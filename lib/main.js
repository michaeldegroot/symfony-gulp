'use strict'

const gulp           = require('gulp')
const path           = require('path')
const tasks          = require('./tasks')
const symfony        = require('./symfony.js')
const util           = require('./util')
const log            = util.log
const updateNotifier = require('update-notifier')
const pkg            = require('../package.json')
const fs             = require('fs')
const async          = require('async')
const concat         = require('gulp-concat')
const os             = require('os')
const mkdirp         = require('mkdirp')
const cleanCss       = require('gulp-clean-css')
const uglify         = require('gulp-uglify')

updateNotifier({pkg}).notify() // Notify when a update is availible

// Default task
gulp.task('default', () => {
  tasks.execute('buildAll')
})

// Generate task
gulp.task('generate', () => {
  let argument = util.processCmd(process.argv[4])

  if (!process.argv[4])
    argument = util.processCmd(process.argv[3])

  symfony.getAssets(path.join(argument, '**'), resources => {
    util.askFiles(resources.js, 'Select JS to concat and minify', jsResults => {
      util.askFiles(resources.css, 'Select CSS to concat and minify', cssResults => {
        util.generateJson({css: cssResults, js: jsResults, bundle: argument}, err => {
          if (err)
            throw new Error(err)

          log('OK', 'symfony-gulp.json generated!')
        })
      })
    })
  })
})

// Build task
gulp.task('build', () => {
  if (!process.argv[3]) {
    if (util.checkJson() === false)
      return

    const config = require(path.join(util.directory(), 'symfony-gulp.json'))
    const cssFolder = path.join(util.directory(), 'web', 'symgulp', 'css')
    const jsFolder = path.join(util.directory(), 'web', 'symgulp', 'js')
    const gulpFolder = path.join(util.directory(), 'web', 'symgulp')

    // Create folders if not exist
    mkdirp(gulpFolder, () => {
      mkdirp(cssFolder, () => {
        mkdirp(jsFolder, () => {
          for (let bundle in config) {
            log('OK', bundle + '.css')
            gulp.src(config[bundle].css).pipe(concat(bundle + '.css')).pipe(cleanCss({compatibility: 'ie8', keepSpecialComments: false})).pipe(gulp.dest(cssFolder))


            log('OK', bundle + '.js')
            gulp.src(config[bundle].js).pipe(concat(bundle + '.js')).pipe(uglify()).pipe(gulp.dest(jsFolder))
          }
        })
      })
    })
    return
  }

  if (process.argv[3] === 'js') {
    tasks.execute('buildJs')
    return
  }

  if (process.argv[3] === 'css') {
    tasks.execute('buildCss')
    return
  }

  if (process.argv[3] === 'all') {
    tasks.execute('buildAll')
    return
  }

  log('FAIL', 'Unknown option: ' + process.argv[3])
})


// Prints resources
gulp.task('resource', () => {
  const argument = util.processCmd(process.argv[3])

  if (!process.argv[3]) {
    symfony.getAssets(path.join(util.processCmd(process.argv[3]), '**'), files => {
      util.printFiles(files, 'js')
    })
    symfony.getAssets(path.join(util.processCmd(process.argv[3]), '**'), files => {
      util.printFiles(files, 'css')
    })
    return
  }

  if (process.argv[3] === 'js') {
    symfony.getAssets(path.join(util.processCmd(process.argv[4]), '**'), files => {
      util.printFiles(files, 'js')
    })
    return
  }

  if (process.argv[3] === 'css') {
    symfony.getAssets(path.join(util.processCmd(process.argv[4]), '**'), files => {
      util.printFiles(files, 'css')
    })
    return
  }

  log('FAIL', 'Unknown option: ' + process.argv[3])
})

// Find out if we need to start the default task or something else
let startTask = process.argv[2]
if (!process.argv[2])
  startTask = 'default'

// Start the task
gulp.start(startTask)
