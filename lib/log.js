'use strict'

const clc = require('cli-color')
const moment = require('moment')

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
    statusMsg = clc.orange(code)
  }

  statusMsg = '[' + statusMsg + '] '

  if (code === 'CLEAR')
    statusMsg = ''

  finalMsg = '' + timestamp + ' - ' + statusMsg + msg

  console.log(finalMsg)
}
