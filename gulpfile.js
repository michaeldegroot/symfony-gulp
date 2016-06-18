'use strict'

const gulp  = require('gulp')
const watch = require('gulp-watch')

gulp.task('default', () => {
  console.log('First time install')
  reinstall(() => {
    console.log('Install done!')
    gulp.watch([
      'lib/**/*',
    ], {debounceDelay: 5000}, (() => {
      console.log('Files changed, reinstalling globally')
      reinstall(() => {
        console.log('Install done!')
      })
    }))
  })
})

const reinstall = cb => {
  const exec = require('child_process').exec
  const child = exec('npm install -g', (error, stdout, stderr) => {
    if (error) {
      throw new Error(error)
    } else {
      cb()
    }
  })
}
