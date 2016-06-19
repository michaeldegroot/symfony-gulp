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

updateNotifier({pkg}).notify() // Notify when a update is availible

// Default task
gulp.task('default', () => {
  tasks.execute('buildAll')
})

// Print all resources in use via templates
gulp.task('resource', () => {
  const argument = util.processCmd(process.argv[3])
  symfony.getResourcesInUse(argument, (err, resources) => {
    if (err)
      throw new Error(err)

    log('OK', 'Done.')
    log('NONE', 'Total resources in use: ' + (resources.css.length + resources.js.length))
    log('NONE', 'CSS: ' + resources.css.length)
    log('NONE', 'JS:  ' + resources.js.length)
  })
})

// Generate task
gulp.task('generate', () => {
  let argument = util.processCmd(process.argv[4])

  if (!process.argv[4])
    argument = util.processCmd(process.argv[3])

  symfony.getResourcesInUse(argument, (err, resources) => {
    util.askFiles(util.resourceArray(resources.js, 'path'), 'Select JS to concat and minify', jsResults => {
      util.askFiles(util.resourceArray(resources.css, 'path'), 'Select CSS to concat and minify', cssResults => {
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
    for (let bundle in config) {

      // Concat css
      // TODO: make it workszzz
      console.log(path.join(util.directory(), 'test.css'))
      console.log(config[bundle].css[0])

      log('OK', 'CSS Concat')

      gulp.src(config[bundle].css[0]).pipe(concat('test.css')).pipe(gulp.dest(util.directory()))
    }

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

// Js task
gulp.task('js', () => {
  symfony.getAssets(path.join(util.processCmd(process.argv[3]), '**'), files => {
    util.printFiles(files, 'js')
  })
})

// Css task
gulp.task('css', () => {
  symfony.getAssets(path.join(util.processCmd(process.argv[3]), '**'), files => {
    util.printFiles(files, 'css')
  })
})

// Find out if we need to start the default task or something else
let startTask = process.argv[2]
if (!process.argv[2])
  startTask = 'default'

// Start the task
gulp.start(startTask)
