<?php

function parseMoveData($jsonObj, $langLines) {
	$move = $jsonObj->data->combatMove;

	// moves w/o energyDelta appear to be max moves,
	// and are not wanted
	if (!isset($move->energyDelta)) return null;
	
	preg_match('/\d+/', $jsonObj->templateId, $matches);
	$name = 'move_name_' . $matches[0];
	$name = isset($langLines[$name]) ? $langLines[$name] : $name;

	$value = $move->uniqueId;
	if (is_numeric($move->uniqueId)) {
		// uniqueId is normally a string, but in the case of Aura Wheel,
		// the game master suddenly started using ints (having used strings
		// there too, previously); so, convert them to strings following
		// uniqueId's usual pattern...

		$value = substr(
			$jsonObj->data->templateId,
			strpos($jsonObj->data->templateId, 'MOVE_') + 5
		);
	}

	$moveData = [
		'value' => $value,
		'type' => $move->type,
		'label' => $name,
		'energyDelta' => $move->energyDelta
	];

	// durationTurns in the game master seems to be a 0-index?
	// add 1 for our values

	if (isset($move->durationTurns)) {
		$moveData['durationTurns'] = $move->durationTurns + 1;
	} else if ($move->energyDelta > 0) {
		// or if durationTurns is not set on a fast move, 
		// it's a 1 turn move
		$moveData['durationTurns'] = 1;
	}

	return $moveData;
}
