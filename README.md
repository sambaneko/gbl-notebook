# GBL Notebook

An app to keep track of Pokemon Go GBL teams over the seasons.  It's inconvenient to store a lot of teams in the game itself, and there's nowhere to store your own meta data like contextual notes or strategies.

I also wanted to keep track of the opponents I would regularly encounter in each cup.  There are plenty of resources where you can look up the top ranked contenders in a given format, but this often doesn't match what I'm seeing in practice, so I wanted to document what I actually ran into.

## Development

I'm building this app for personal use in my free time; updates will be sporadic and follow my whims and wants for the app.  I don't expect others to contribute, but made it open source if anyone wants to use or fork it.  There will certainly be bugs.  Optimization isn't a particular goal at the moment, so the code may be a ridiculous mess in some spots.

I'm mostly using this on desktop, so while there's some styling available, I'm not typically focused on the layout for small screens; it may be wonky there.

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

## Pokemon Images

It's a bit troublesome to manage so many Pokemon images, so by default, the app is set in a "No Images" mode, which renders Pokemon views with just text and type icons.  If you want to add images, the app's default path for them is in `public/images/pokemon`, but you can also set a custom path in the app's `.env.local` file.

Image names should match those in the [PokeMiners' pogo_assets](https://github.com/PokeMiners/pogo_assets) repo, in the `Images/Pokemon/Addressable Assets` path; you can use these commands to pull just that path:

```
> git clone --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/PokeMiners/pogo_assets.git .
> git sparse-checkout set --no-cone "Images/Pokemon/Addressable Assets"
> git checkout
```

If you enable "Images" mode without having populated the images, you'll get some default images instead; defaults are also used if the Pokeminers repo is missing an image (such as, at time of writing, Dachsbun or G-Corsola).

## Data Storage

Data is saved in local storage, so it's only accessible to your browser.  There is an export function in the Settings, which allows data to be backed up, or ported to another browser.  I'd recommend making regular backups.

## Languages and Text
During installation, you could select a different language file from the assets repo.  If you do, modify this line in `src/game-data/parse-latest.php` to match your chosen language:

```
$language = 'English';
```

I haven't thoroughly tested other languages, and the interface text will remain in English.

In the `src/game-data/languages` directory, there is also an example file named `English_patch.txt`.  For whatever reason, not all translatable resources have a corresponding entry in the language files.  To accomodate this, you can use this patch file to add any missing resource/text pairs; after doing so, rerun the parser.

## Acknowledgements

This is a fan-made project intended for personal use and educational purposes, which the author believes is covered by fair use.  Pokémon Go is the property of The Pokemon Company and Niantic.  The game master file and other assets are from the [PokeMiners](https://github.com/PokeMiners) repo.