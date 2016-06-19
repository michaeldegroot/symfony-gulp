'use strict'

const async = require('async')
const timer = require('./timer')
const log   = require('./util').log

// How tasks are being executed
exports.execute = task => {
  let time = new timer()
  log('CLEAR', 'Executing task: ' + task)
  if (task === 'buildAll') {
    async.parallel({
      js: callback => {
        buildJs(() =>  {
          callback()
        })
      },

      css: callback => {
        buildCss(() =>  {
          callback()
        })
      },
    }, function(err, results) {
      notifyTaskComplete(task, time)
    })
  }

  if (task === 'buildJs') {
    notifyTaskComplete(task, time)
  }

  if (task === 'buildCss') {
    notifyTaskComplete(task, time)
  }
}

const buildCss = cb => {
  cb()
}


const buildJs = cb => {
  cb()
}

const notifyTaskComplete = (task, time) => {
  log('OK', 'task ' + task + 'complete (' + time.stop() + 'ms)')
}
