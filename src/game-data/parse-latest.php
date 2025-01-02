<?php

require('parse-language.inc.php');
require('parse-pokemon-data.inc.php');
require('parse-pokemon-forms.inc.php');
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

	if (isset($jsonObj->data->combatMove)) {
		$move = parseMoveData($jsonObj, $langLines);
		if (!is_null($move)) $output['moves'][] = $move;
	}	
}

$output['pokemon'] = parsePokemonForms($forms, $output['pokemon'], []);

foreach ($output as $name => $data) {
	file_put_contents("parsed/{$name}.json", json_encode($data, JSON_PRETTY_PRINT));
}