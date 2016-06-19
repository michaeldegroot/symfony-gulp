'use strict'

const gulp           = require('gulp')
const path           = require('path')
const tasks          = require('./tasks')
const symfony        = require('./symfony.js')
const util           = require('./util.js')
const log            = require('./log.js').log
const workingDir     = require('./workingdir').directory()
const updateNotifier = require('update-notifier')
const pkg            = require('../package.json')

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
    console.log('Total resources in use: ' + (resources.css.length + resources.js.length))
    console.log('CSS: ' + resources.css.length)
    console.log('JS:  ' + resources.js.length)
  })
})

// Js Task
gulp.task('js', () => {
  let argument = util.processCmd(process.argv[3])
  if (argument === 'build') {
    tasks.execute('buildJs')
    return
  }

  if (argument === 'generate') {
    argument = util.processCmd(process.argv[4])

    symfony.getResourcesInUse(argument, (err, resources) => {
      util.askFiles(resources.js, 'Select JS to concat and minify', results => {

      })
    })
  }

  if (!argument) {
    argument = util.processCmd(process.argv[3])
    symfony.getAssets(path.join(argument, '**'), files => {
      util.printFiles(files, 'js')
    })
    return
  }
})

// Css Task
gulp.task('css', () => {
  let argument = util.processCmd(process.argv[3])

  if (argument === 'build') {
    tasks.execute('buildCss')
  }

  if (argument === 'generate') {
    argument = util.processCmd(process.argv[4])

    symfony.getResourcesInUse(argument, (err, resources) => {
      util.askFiles(resources.css, 'Select CSS to concat and minify', results => {

      })
    })
  }

  if (!argument) {
    argument = util.processCmd(process.argv[3])
    symfony.getAssets(path.join(argument, '**'), files => {
      util.printFiles(files, 'css')
    })
  }
})

// Find out if we need to start the default task or something else
let startTask = process.argv[2]
if (!process.argv[2])
  startTask = 'default'

// Start the task
gulp.start(startTask)
