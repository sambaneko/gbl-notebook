<?php

function parseMoveData($jsonObj, $langLines) {
	$move = $jsonObj->data->combatMove;

	// moves w/o energyDelta appear to be dmax/gmax,
	// and are not wanted
	if (!isset($move->energyDelta)) return null;
	
	preg_match('/\d+/', $jsonObj->templateId, $matches);
	$name = 'move_name_' . $matches[0];
	$name = isset($langLines[$name]) ? $langLines[$name] : $name;

	$moveData = [
		'value' => $move->uniqueId,
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
