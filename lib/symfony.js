'use strict'

const async      = require('async')
const glob       = require('glob')
const log        = require('./log.js')
const path       = require('path')
const workingDir = process.cwd()

// Load and check the symfony-gulp.json for errors
exports.checkJson = cb => {
  try {
    let config = require(path.join(workingDir, 'symfony-gulp.json'))
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.error('No symfony-gulp.json found in your project root folder.')
      process.exit()
    }

    cb('Your symfony-gulp.json is not valid JSON:\n' + err)
  }

  cb(null, config)
}

// How to get all symfony assets from a specific bundle
exports.getAssets = (bundle, cb) => {
  // If no bundle is defined, we get ALL files
  if (!bundle)
    bundle = '**'

  // Get JS and CSS files in parallel
  async.parallel({
    css: callback => {
      glob(path.join(workingDir, 'src', bundle, '*.css'), null, (err, cssFiles) => {
        callback(err, cssFiles)
      })
    },

    js: callback => {
      glob(path.join(workingDir, 'src', bundle, '*.js'), null, (err, jsFiles) => {
        callback(err, jsFiles)
      })
    },
  },
  function(err, results) {
    // Set some variables before releasing in the wild.
    // They grow up so quickly!
    results.pwd     = path.join(workingDir, 'src', bundle)
    results.bundle  = bundle

    // Normalize the JS paths
    for (let i = 0; i < results.js.length; i++) {
      results.js[i] = path.normalize(results.js[i])
    }

    // Normalize the CSS paths
    for (let i = 0; i < results.css.length; i++) {
      results.css[i] = path.normalize(results.css[i])
    }

    cb(results)
  })
}
