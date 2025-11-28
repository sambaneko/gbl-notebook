# GBL Notebook

An app to keep track of Pokemon Go GBL teams over the seasons.  It's inconvenient to store a lot of teams in the game itself, and there's nowhere to store your own meta data like contextual notes or strategies.

I also wanted to keep track of the opponents I would regularly encounter in each cup.  There are plenty of resources where you can look up the top ranked contenders in a given format, but this often doesn't match what I'm seeing in practice, so I wanted to document what I actually ran into.

## Development

I'm building this app for personal use in my free time; updates will be sporadic and follow my whims and wants for the app.  I don't expect others to contribute, but made it open source if anyone wants to use or fork it.  There will certainly be bugs.  Optimization isn't a particular goal at the moment, so the code may be a ridiculous mess in some spots.

I'm mostly using this on desktop, so while there's some styling available, I'm not typically focused on the layout for small screens; it may be wonky there.

## Build

The latest master build can be found at https://sambaneko.github.io/gbl-notebook

The app uses React Router's BrowserRouter by default, but this instance uses HashRouter because I couldn't get the former to work properly on Github Pages (if you run it locally, you can use either).

## Local Setup

To run the app locally, clone the repo and `npm install`.  Now you can run (`npm start`) or build (`npm build`) the app.

The repo includes pre-parsed copies of the game master data in English.  As Niantic releases updated masters, the parsed data will become outdated, and you'll need to either grab new copies from this repo, or grab the new game master and parse it locally.

If you want to parse the game master locally, you will also need PHP, and some external resources:

* From the [PokeMiners Game Assets repo](https://github.com/PokeMiners/pogo_assets), download `Texts/Latest APK/English.txt` and put it in the repo's `src/game-data/languages` directory
* From the [PokeMiners Game Master repo](https://github.com/PokeMiners/game_masters), download `latest/latest.json` and put it in the repo's `src/game-data` directory
* In the `src/game-data` directory, run `php parse-latest.php`, which will create 3 files in the `src/game-data/parsed` directory: `leagues.json`, `moves.json` and `pokemon.json` 

## Pokemon Images

It's a bit troublesome to manage thousands of Pokemon images, so by default, there are no Pokemon images in the repo, and the app is set in a "No Images" mode, which renders Pokemon views with just text and type icons.  If you want to add and enable images, the app's default path for them is in `public/images/pokemon`, but you can also set a custom path in the app's `.env.local` file.

Image names should match those in the [PokeMiners' pogo_assets](https://github.com/PokeMiners/pogo_assets) repo, in the `Images/Pokemon/Addressable Assets` path; you can use these commands to pull just that path:

```
> git clone --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/PokeMiners/pogo_assets.git .
> git sparse-checkout set --no-cone "Images/Pokemon/Addressable Assets"
> git checkout
```

After you've added the images, enable their display in Settings. If you enable "Images" mode without having populated the images, you'll get some default images instead; defaults are also used if the Pokeminers repo is missing an image (such as, at time of writing, Corviknight, Dachsbun or G-Corsola).

## Data Storage

Data is saved in local storage, so it's only accessible to the browser in which it was created.  There is an export function in the Settings, which allows data to be backed up, or ported to another browser.  I'd recommend making regular backups.

## Languages and Text
When parsing the game master, you could select a different language file from the assets repo.  If you do, modify this line in `src/game-data/parse-latest.php` to match your chosen language:

```
$language = 'English';
```

I haven't thoroughly tested other languages, and the interface text will remain in English.

In the `src/game-data/languages` directory, there is also a file named `English_patch.txt`.  For whatever reason, not all translatable resources have a corresponding entry in the language files.  To accomodate this, you can use this patch file to add any missing resource/text pairs; after doing so, rerun the parser.

## Acknowledgements

This is a fan-made project intended for personal use and educational purposes, which the author believes is covered by fair use.  Pokémon Go is the property of The Pokemon Company and Niantic.  The game master file and other assets are from the [PokeMiners](https://github.com/PokeMiners) repo.