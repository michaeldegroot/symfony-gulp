'use strict'

const path       = require('path')
const inquirer   = require('inquirer')
const clc        = require('cli-color')
const moment     = require('moment')

exports.printFiles = (files, type) => {
  let pwd = files.pwd

  if (type === 'js')
    files = files.js

  if (type === 'css')
    files = files.css

  if (files.length === 0) {
    exports.log('FAIL', 'Could not find any files!')
    exports.log('CLEAR', 'Directory: ' + pwd)
  } else {
    for (let i = 0;i < files.length; i++) {
      exports.log('CLEAR', path.basename(files[i]))
    }

    exports.log('OK', 'Found ' + files.length + ' files')
  }
}

exports.processCmd = cmdArgument => {
  let result = ''

  if (cmdArgument)
    result = cmdArgument

  return path.normalize(result)
}

exports.askFiles = (files, text, cb) => {
  let choices = []
  for (let i = 0; i < files.length; i++) {
    choices.push({
      name: files[i],
    })
  }

  inquirer.prompt([
    {
      type: 'checkbox',
      message: text,
      name: 'results',
      choices: choices,
    },
  ]).then(answers => {
    cb(answers)
  })
}

exports.directory = () => {
  const testing = true

  if (testing)
    return 'D:\\code\\dsj\\jingo'

  return process.cwd()
}

exports.log = (code, msg) => {
  let finalMsg = ''
  let statusMsg = ''
  let timestamp = moment().format('H:mm:ss')

  if (code === 'FAIL') {
    statusMsg = clc.red(code)
  }

  if (code === 'OK') {
    statusMsg = clc.green(code)
  }

  if (code === 'WARN') {
    statusMsg = clc.yellow(code)
  }

  statusMsg = '[' + statusMsg + '] '

  if (code === 'CLEAR')
    statusMsg = ''

  finalMsg = '' + timestamp + ' - ' + statusMsg + msg

  if (code === 'NONE') {
    console.log(msg)
    return
  }

  console.log(finalMsg)
}
