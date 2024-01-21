<?php

function parseMoveData($jsonObj, $langLines) {
	$stg = $jsonObj->data->moveSettings;

	$name = 'move_name_' . substr($jsonObj->templateId, 1, 4);
	$name = isset($langLines[$name]) ? $langLines[$name] : $name;

	return [
		'templateId' => $jsonObj->templateId,
		'value' => $stg->movementId,
		'type' => $stg->pokemonType,
		'label' => $name
	];
}
