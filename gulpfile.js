'use strict'

const gulp  = require('gulp')
const watch = require('gulp-watch')

gulp.task('default', () => {
  gulp.watch([
    'lib/**/*',
  ], {debounceDelay: 2000}, (() => {
    console.log('Files changed, reinstalling globally')
    reinstall()
  }))
})

const reinstall = () => {
  const exec = require('child_process').exec
  const child = exec('npm install -g', (error, stdout, stderr) => {
    if (error) {
      throw new Error(error)
    } else {
      console.log('Done!')
    }
  })
}

reinstall()
