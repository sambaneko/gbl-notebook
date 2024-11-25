<?php

require('parse-language.inc.php');
require('parse-pokemon-data.inc.php');
require('parse-league-data.inc.php');
require('parse-move-data.inc.php');

$latestJsonFile = 'latest.json';
$language = 'English';

if (!file_exists($latestJsonFile)) {
	exit('Game master JSON file is missing');
}

if (!file_exists("languages/{$language}.txt")) {
	exit('Language file is missing');
}

$langLines = parseLanguage($language);
$latestJson = json_decode(
	file_get_contents($latestJsonFile)
);

$output = [
	'leagues' => [],
	'pokemon' => [],
	'moves' => []
];

$forms = [];

foreach ($latestJson as $jsonObj) {
	if (isset($jsonObj->data->pokemonSettings)) {
		$pokemon = parsePokemonData($jsonObj, $langLines);
		if ($pokemon !== false) {
			$output['pokemon'][] = $pokemon;
		}
	}

	if (isset($jsonObj->data->formSettings)) {
		if (
			isset($jsonObj->data->formSettings->pokemon) &&
			isset($jsonObj->data->formSettings->forms)
		) {
			$monForms = [];

			foreach (
				$jsonObj->data->formSettings->forms as $form
			) {
				if (isset($form->form)) {
					$monForms[] = $form->form;
				}
			}

			if (!empty($monForms)) {
				$forms[$jsonObj->data->formSettings->pokemon] = $monForms;
			}
		}
	}	

	if (isset($jsonObj->data->combatLeague)) {
		$move = parseLeagueData($jsonObj, $langLines);
		if ($move !== false) {
			$output['leagues'][] = $move;
		}
	}

	if (isset($jsonObj->data->moveSettings)) {
		$output['moves'][] = parseMoveData($jsonObj, $langLines);
	}	
}

// this prunes out forms that are not actually accessible,
// like Shellos w/o an east/west designation
foreach ($forms as $pokemon => $formNames) {
	$indices = array_keys(
			array_filter(
				$output['pokemon'], 
				function($subArray) use ($pokemon) {
					return $subArray['pokemonId'] === $pokemon;
				}
		)
	);

	foreach ($indices as $i) {
		if (
			!isset($output['pokemon'][$i]['form']) ||
			!in_array(
				$output['pokemon'][$i]['form'],
				$formNames
			)
		) {
			unset($output['pokemon'][$i]);
		}
	}
}

// the form filtering causes explicit indices; get rid of them
$output['pokemon'] = array_values($output['pokemon']);

foreach ($output as $name => $data) {
	file_put_contents("parsed/{$name}.json", json_encode($data, JSON_PRETTY_PRINT));
}