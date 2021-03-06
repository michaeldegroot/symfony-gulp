# symfony-gulp

**WORK IN PROGRESS!**

Simplify your symfony project by automating your concat and minify workflow

## Features

 -  Build symfony assets parallel with gulp
 -  Easily minify and concat JS & CSS files
 -  ~~Can watch for changes and automatically rebuild~~ **Not yet available**
 -  Asks you to generate a symfony-gulp file by showing you what files to use for concat and minify
 -  ~~Can list all resources (js, css) you use in your html.twig files in a specific bundle or overall project~~ **On Hold**
 -  Can list all js or css files stored in a specific bundle or overall project

## Installation

`npm install symfony-gulp -g`

## How to use

1. Install symfony-gulp
2. Go to your symfony project root folder
3. Excute a task!

## Tasks

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

 - `symgulp resource js/css [bundle]`

*Lists all resources (js or css) in use by specified bundle.*
*Can specify a bundle, if no bundle is specified ALL bundles will be used*

*Get all stylesheet files from a given bundle, if no bundle is given ALL stylesheet files will be retrieved.*

## Known issues
https://github.com/michaeldegroot/symfony-gulp/issues
