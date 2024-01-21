# GBL Notebook

A small app I made to keep track of my Pokemon Go GBL teams, and notable opponent data.  Keeping track of teams within the game itself is not convenient:

* Storing many teams results in cluttered UI, and you can't rearrange them.
* Unforseen bugs may occassionally delete your stored teams entirely.
* Using tags don't preserve information like team order or move sets, and again becomes cluttered if you have a lot of them.
* There's nowhere to add any contextual notes for gameplay strategies.

I also wanted to keep track of the opponents I would regularly encounter in each cup.  There are plenty of resources where you can look up the top ranked contenders in a given format, but this often doesn't match what I'm seeing in practice, so I wanted to document what I actually ran into.

## Updates and Notes

Initial commit; I'm not expecting anyone to be seeing or using this yet... I'm sure there are many bugs.  I'm currently using this exclusively on desktop, so the layout isn't great on small screens.

## Preview

A preview (or usable version) of the app can be found on my site: [GBL Notebook](https://gbl.spacecatsamba.com)

## Local Setup

To run a local copy of the app, you'll need git, NodeJS and PHP.  The app is made with React, but uses PHP to parse the game master file into pruned, usable formats.  Game assets are mostly not included in the repo, so you'll need to fetch them yourself.

* First clone the repo and `npm install`
* Next retrieve the necessary game assets, and parse them:
	* From the [PokeMiners Game Master repo](https://github.com/PokeMiners/game_masters), download `latest/latest.json` and put it in the repo's `src/game-data` directory
	* From the [PokeMiners Game Assets repo](https://github.com/PokeMiners/pogo_assets), download `Texts/Latest APK/English.txt` and put it in the repo's `src/game-data/languages` directory
	* In the `src/game-data` directory, run `php parse-latest.php`, which will create 3 files in the `src/game-data/parsed` directory: `leagues.json`, `moves.json` and `pokemon.json` 

* Now you can run (`npm start`) or build (`npm build`) the app.

* The app includes some default images; to add Pokemon images, run the following in the `public/images/pokemon` directory:

```
> git clone --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/PokeMiners/pogo_assets.git .
> git sparse-checkout set --no-cone "Images/Pokemon/Addressable Assets"
> git checkout
> mv "Images/Pokemon/Addressable Assets/*" .
> rmdir -R ./Images
```

## Data Storage

Data is saved in local storage, so it's only accessible to your browser.  There is an export function in the Settings, which allows data to be backed up, or ported to another browser.

## Languages and Text
During installation, you could select a different language file from the assets repo.  If you do, modify this line in `src/game-data/parse-latest.php` to match your chosen language:

```
$language = 'English';
```

I haven't thoroughly tested other languages, and the interface text will remain in English.

In the `src/game-data/languages` directory, there is also an example file named `English_patch.txt`.  For whatever reason, not all translatable resources have a corresponding entry in the language files.  To accomodate this, you can use this patch file to add any missing resource/text pairs; after doing so, rerun the parser.

## Acknowledgements

This is a fan-made project intended for personal use and educational purposes, which the author believes is covered by fair use.  Pokémon Go is the property of The Pokemon Company and Niantic.  Thanks to the [PokeMiners](https://github.com/PokeMiners) for providing the game master file and other assets.