'use strict'

const gulp       = require('gulp')
const path       = require('path')
const tasks      = require('./tasks')
const symfony    = require('./symfony.js')
const util       = require('./util.js')
const log        = require('./log.js')
const workingDir = process.cwd()

// Default task
gulp.task('default', () => {
  tasks.execute('buildAll')
})

// Print all resources in use via templates
gulp.task('resource', () => {
  const argument = util.processCmd(process.argv[3])

})

// Js Task
gulp.task('js', () => {
  const argument = util.processCmd(process.argv[3])

  if (!argument || argument !== 'build') {
    symfony.getAssets(path.join(argument, '**'), files => {
      util.printFiles(files, 'js')
    })
    return
  }

  tasks.execute('buildJs')
})

// Css Task
gulp.task('css', () => {
  const argument = util.processCmd(process.argv[3])

  if (!argument || argument !== 'build') {
    symfony.getAssets(path.join(argument, '**'), files => {
      util.printFiles(files, 'css')
    })
    return
  }

  tasks.execute('buildCss')
})

// Find out if we need to start the default task or something else
let startTask = process.argv[2]
if (!process.argv[2])
  startTask = 'default'

// Start the task
gulp.start(startTask)
