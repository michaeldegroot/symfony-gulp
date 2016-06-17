'use strict'

let workingDir = process.cwd()

let gulp = require('gulp')
let path = require('path')

try {
  let config = require(path.join(workingDir, 'symfony-gulp.json'))
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.error('No symfony-gulp.json found in your project root folder.')
    process.exit()
  }
  throw new Error('Your symfony-gulp.json is not valid JSON:\n' + err)
}

// This is the default task for gulp
gulp.task('default', () => {
  task('buildAll')
})

// How tasks are being executed
const task = task => {
  // Default
  if (task === 'buildAll') {
    console.log('buildAll task')
  }
}

// Find out if we need to start the default task or something else
let cmd = process.argv[2]

let startTask
startTask = cmd

if (!cmd)
  startTask = 'default'

// Start the task
gulp.start(startTask)
