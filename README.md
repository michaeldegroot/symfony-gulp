# symfony-gulp

**WORK IN PROGRESS!**

Simplify your symfony project by automating your concat and minify workflow

## Features

 -  Build symfony assets parallel with gulp
 -  Easily minify and concat JS & CSS files
 -  Can watch for changes and automatically rebuild
 -  Knows what files you use in your html.twig files

## Installation

`npm install symfony-gulp -g`

## How to use symgulp

1. Install symfony-gulp
2. Go to your symfony project root folder
3. Excute a task!

#### default task

- `symgulp`

Now you have activated the default task, which is to rebuild all

*When you activate symgulp for the first time, it will generate a symfony-gulp.json file*
*. This file contains how symgulp knows what to do exactly in your symfony project*

#### generate task

 - `symgulp generate [bundle]`

*generates a symfony-gulp.json so symfony-gulp knows how to build js and css files*

#### build task

 - `symgulp build [option]`

*Options can be 'js', 'css' or 'all'*

#### resource task

 - `symgulp resource [bundle]`

*Lists all resources (js, css) in use by templates.*
*Can specify a bundle, if no bundle is speficied ALL bundles will be used*

#### js task

 - `symgulp js [bundle]`

*Get all javascript files from a given bundle, if no bundle is given ALL javascript files will be retrieved.*

#### css task

 - `symgulp css [bundle]`

*Get all stylesheet files from a given bundle, if no bundle is given ALL stylesheet files will be retrieved.*

## Known issues
https://github.com/michaeldegroot/symfony-gulp/issues
