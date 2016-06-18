'use strict'

const gulp       = require('gulp')
const path       = require('path')
const tasks      = require('./tasks')
const symfony    = require('./symfony.js')
const log        = require('./log.js')
const workingDir = process.cwd()

// Default task
gulp.task('default', () => {
  tasks.execute('buildAll')
})

// Print all found js files
gulp.task('jsfiles', () => {
  symfony.getAssets(process.argv[3], files => {
    if (files.js.length === 0) {
      console.log('Could not find any JS files!')
      console.log('Bundle:', files.bundle)
      console.log('Working directory:', files.pwd)
    } else {
      console.log('Found ' + files.js.length + ' JS files')

      for (let i = 0;i < files.js.length; i++) {
        console.log(files.js[i].split(workingDir)[1])
      }
    }
  })
})

// Find out if we need to start the default task or something else
let startTask = process.argv[2]
if (!process.argv[2])
  startTask = 'default'

// Start the task
gulp.start(startTask)
