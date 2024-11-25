<?php

/** convert older data format to new version; should not be needed
 * by anyone besides me, but retaining it
 */

$oldJson = json_decode(
	file_get_contents('old.json')
);

$movesJson = json_decode(
	file_get_contents('parsed/moves.json')
);

$pokemonJson = json_decode(
	file_get_contents('parsed/pokemon.json')
);

$output = [
	'teams' => [],
	'templates' => [],
	'opponents' => [],
	'current' => [],
	'faves' => []
];

$uuids = [];

function getUUID() {
	return vsprintf( '%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4) );
}

function getMoveFromRef($val) {
	global $movesJson;
	foreach ($movesJson as $move) {
		if ($val == $move->value) {
			return $move->templateId;
		}						
	}
}

function remapTemplateId($templateId) {
	global $pokemonJson;
	$found = '';
	foreach ($pokemonJson as $pokemon) {
		if ($templateId == $pokemon->templateId) {
			return $templateId;
		}

		$p1 = explode('_', $templateId);
		$p2 = explode('_', $pokemon->templateId);
		if (
			$p1[0] == $p2[0] &&
			empty($found)
		) {
			$found = $pokemon->templateId;
		}
	}
	return $found;
}

foreach ($oldJson->seasons as $seasonId => $vals) {
	if ($seasonId == 0) continue;

	foreach ($vals->cups as $cupId => $cupVals) {
		foreach ($cupVals->teams as $team) {
			$uuid = getUUID();
			while (in_array($uuid, $uuids)) {
				$uuid = getUUID();
			}

			$uuids[] = $uuid;

			foreach ($team->mons as &$mon) {
				if (!isset($mon->fast->templateId)) {
					$mon->fast = getMoveFromRef($mon->fast->value);
				} else if (!isset($mon->charge1->templateId)) {
					$mon->charge1 = getMoveFromRef($mon->charge1->value);
				} else if (!isset($mon->charge2->templateId)) {
					$mon->charge2 = getMoveFromRef($mon->charge2->value);
				} else {
					$mon->fast = $mon->fast->templateId;
					$mon->charge1 = $mon->charge1->templateId;
					$mon->charge2 = $mon->charge2->templateId;
				}

				$mon->templateId = remapTemplateId($mon->templateId);
			}

			$output['teams'][] = [
				'id' => $uuid,
				'created' => isset($team->created)
					? $team->created
					: '',
				'modified' => isset($team->modified)
					? $team->modified
					: '',
				'mons' => $team->mons,
				'notes' => $team->notes,
				'season' => $seasonId,
				'cup' =>  $cupId
			];
		}

		if (isset($cupVals->opponents)) {
			foreach ($cupVals->opponents as &$ops) {
				$uuid = getUUID();
				while (in_array($uuid, $uuids)) {
					$uuid = getUUID();
				}
		
				$uuids[] = $uuid;
				
				if (!isset($ops->fast->templateId)) {
					$ops->fast = getMoveFromRef($ops->fast->value);
				} else {
					$ops->fast = $ops->fast->templateId;
				}
		
				if (!isset($ops->charge1->templateId)) {
					$ops->charge1 = getMoveFromRef($ops->charge1->value);
				} else {
					$ops->charge1 = $ops->charge1->templateId;
				}
		
				if (isset($ops->charge2)) {
					if (!isset($ops->charge2->templateId)) {
						$ops->charge2 = getMoveFromRef($ops->charge2->value);
					} else {			
						$ops->charge2 = $ops->charge2->templateId;
					}
				}
		
				$ops->templateId = remapTemplateId($ops->templateId);

				$output['opponents'][] = array_merge(
					[
						'id' => $uuid,
						'season' => $seasonId,
						'cup' =>  $cupId
					],
					(array)$ops
				);
			}
		}
	}
}

foreach ($oldJson->templates as &$vals) {
	if (!isset($vals->fast)) {
		continue;
	}
	$vals->fast = $vals->fast->templateId;
	$vals->charge1 = $vals->charge1->templateId;
	if (isset($vals->charge2)) {
		$vals->charge2 = $vals->charge2->templateId;
	}

	unset($vals->templateType);

	$output['templates'][] = $vals;
}

file_put_contents("converted.json", json_encode($output, JSON_PRETTY_PRINT));
