<?php

function parsePokemonData($jsonObj, $langLines) {
	$dexNumber = substr($jsonObj->templateId, 1, 4); // keep string

	if (
		!(
			// exclude atypical forms
			substr($jsonObj->templateId, -7) == '_NORMAL' ||
			substr($jsonObj->templateId, -5) == '_2019' ||
			(
				// exclude a bajillion different pikas
				$dexNumber == '0025' &&
				$jsonObj->templateId != 'V0025_POKEMON_PIKACHU'
			)
		)
	) {
		$stg = $jsonObj->data->pokemonSettings;

		$fastMoves = array_merge(
			isset($stg->quickMoves) ? $stg->quickMoves : [],
			isset($stg->eliteQuickMove) ? $stg->eliteQuickMove : []
		);

		$chargeMoves = array_merge(
			isset($stg->cinematicMoves) ? $stg->cinematicMoves : [],
			isset($stg->eliteCinematicMove) ? $stg->eliteCinematicMove : []
		);

		$types = [$stg->type];
		if (isset($stg->type2)) {
			$types[] = $stg->type2;
		}

		$label = 'pokemon_name_' . $dexNumber;
		$label = isset($langLines[$label]) ? $langLines[$label] : $label;
		$form = 'NORMAL';

		if (isset($stg->form)) {
			$formSplit = explode('_', $stg->form, 2);
			$form = $formSplit[1];

			if ($form == 'ALOLA') {
				$label .= " ({$langLines['alola_pokedex_header']})";
			}
			if ($form == 'GALARIAN') {
				$label .= " ({$langLines['galarian_pokedex_header']})";
			}	
			
			$formLang = 'form_' . strtolower($form);
			if (isset($langLines[$formLang])) {
				$label .= " ({$langLines[$formLang]})";
			}
		}

		$dexNumber = (int)$dexNumber;

		$data = [
			'value' => $jsonObj->templateId,
			'templateId' => $jsonObj->templateId,
			'pokemonId' => $stg->pokemonId,
			'dexNumber' => $dexNumber,
			'shadowAvailable' => isset($stg->shadow)
		];

		// this is only applicable in two cases
		if (
			$form == 'NORMAL' && (
				$dexNumber == 646 || $dexNumber == 649
			)
		) {
			$data['image'] = "pm{$dexNumber}.fNORMAL";
		}
		
		return array_merge(
			$data, compact(
				'label', 'form', 'types',
				'fastMoves', 'chargeMoves'
			)
		);
	}

	return false;
}