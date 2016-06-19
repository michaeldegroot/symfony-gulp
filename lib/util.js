'use strict'

const path       = require('path')
const inquirer   = require('inquirer')
const clc        = require('cli-color')
const moment     = require('moment')
const jsonfile   = require('jsonfile')
const fs         = require('fs')

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

exports.resourceArray = (array, retrieve) => {
  let returnResult = []
  for (let i = 0; i < array.length; i++) {
    returnResult.push(array[i][retrieve])
  }

  return returnResult
}

// How the symfony-gulp.json is generated
exports.generateJson = (data, cb) => {
  const css = data.css.results
  const js = data.js.results
  let bundle = data.bundle

  if (bundle === '.')
    bundle = 'all'

  let config
  if (fs.existsSync(path.join(exports.directory(), 'symfony-gulp.json'))) {
    config = require(path.join(exports.directory(), 'symfony-gulp.json'))
  } else {
    config = {}
  }

  config[bundle] = {
    css: css,
    js: js,
  }

  jsonfile.writeFile(path.join(exports.directory(), 'symfony-gulp.json'), config, {spaces: 2}, err => {
    if (err)
      cb(err)

    cb(null)
  })
}

// Load and check the symfony-gulp.json for errors
exports.getConfig = cb => {
  try {
    let config = require(path.join(exports.directory(), 'symfony-gulp.json'))
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.error('No symfony-gulp.json found in your project root folder.')
      process.exit()
    }

    cb('Your symfony-gulp.json is not valid JSON:\n' + err)
  }

  cb(null, config)
}

exports.checkJson = () => {
  if (fs.existsSync(path.join(exports.directory(), 'symfony-gulp.json')) === false) {
    exports.log('FAIL', 'No symfony-gulp.json found, did you forget to generate one?')
    return false
  }

  return true
}
