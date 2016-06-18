'use strict'

const workingDir = process.cwd()
const log        = require('./log.js').log
const path       = require('path')

exports.printFiles = (files, type) => {
  let pwd = files.pwd

  if (type === 'js')
    files = files.js

  if (type === 'css')
    files = files.css

  if (files.length === 0) {
    log('FAIL', 'Could not find any files!')
    log('CLEAR', 'Directory:', pwd)
  } else {
    for (let i = 0;i < files.length; i++) {
      log('CLEAR', path.basename(files[i]))
    }

    log('OK', 'Found ' + files.length + ' files')
  }
}

exports.processCmd = cmdArgument => {
  let result = ''

  if (cmdArgument)
    result = cmdArgument

  return path.normalize(result)
}
