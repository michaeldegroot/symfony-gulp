'use strict'

const workingDir = process.cwd()
const log        = require('./log.js')

exports.printFiles = (files, type) => {
  let pwd = files.pwd

  if (type === 'js')
    files = files.js

  if (type === 'css')
    files = files.css

  if (files.length === 0) {
    console.log('Could not find any files!')
    console.log('Directory:', pwd)
  } else {
    for (let i = 0;i < files.length; i++) {
      console.log(files[i].split(workingDir)[1].replace('\\', ''))
    }

    console.log('\n\nFound ' + files.length + ' files')
  }
}

exports.processCmd = cmdArgument => {
  let result = ''

  if (cmdArgument)
    result = cmdArgument

  return result
}
