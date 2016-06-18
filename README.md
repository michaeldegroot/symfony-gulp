# symfony-gulp

**WORK IN PROGRESS**

## Installation
`npm install symfony-gulp -g`

## How to use symgulp?
#### default task
 1.   Go to your symfony project root folder
 2.   type: `symgulp`

Now you have activated the default task, which is to rebuild all

*When you activate symgulp for the first time, it will generate a symfony-gulp.json file*
*. This file contains how symgulp knows what to do exactly in your symfony project*

#### js task
 - `symgulp js [bundle]`

*Get all javascript files from a given bundle, if no bundle is given ALL javascript files will be retrieved.*

 - `symgulp js build`

*Builds all javascript files*

#### css task
 - `symgulp css [bundle]`

*Get all stylesheet files from a given bundle, if no bundle is given ALL stylesheet files will be retrieved.*

 - `symgulp css build`

*Builds all stylesheet files*

## Features

 -    Build symfony assets parallel with gulp
 -    Easily minify and concat JS & CSS files
 -    Can watch for changes and automatically rebuild
 -    Knows what files you use in your html.twig files

## Known issues
https://github.com/michaeldegroot/symfony-gulp/issues
