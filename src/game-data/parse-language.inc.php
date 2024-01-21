<?php

function parseLanguage($language) {
	$handle = fopen("languages/{$language}.txt", 'r');
	$langLines = _parseLines($handle);
	fclose($handle);

	$patchFile = "languages/{$language}_patch.txt";
	if (file_exists($patchFile)) {
		$handle = fopen($patchFile, 'r');
		$langLines = _parseLines($handle, $langLines);
		fclose($handle);
	}

	return $langLines;
}

function _parseLines($handle, $langLines = []) {
	while ($line = fgets($handle)) {
		$split = explode(': ', $line);
		if (
			isset($split[0]) &&
			$split[0] == 'RESOURCE ID'
		) {
			$nextLine = fgets($handle);
			$splitNext = explode(': ', $nextLine, 2);
			$langLines[trim($split[1])] = trim($splitNext[1]);
		}
	}

	return $langLines;
}
