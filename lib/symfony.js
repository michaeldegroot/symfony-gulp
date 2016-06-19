'use strict'

const async      = require('async')
const glob       = require('glob')
const path       = require('path')
const fs         = require('fs')
const readline   = require('readline')
const stream     = require('stream')
const cheerio    = require('cheerio')
const util       = require('./util.js')
const log        = require('./util.js').log
const workingDir = require('./util.js').directory()

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

    twig: callback => {
      glob(path.join(workingDir, 'src', bundle, '*.html.twig'), null, (err, twigFiles) => {
        callback(err, twigFiles)
      })
    },
  },
  function(err, results) {
    // Some extra crap
    results.pwd     = path.join(workingDir, 'src', bundle)
    results.bundle  = bundle

    // Normalize all paths
    results.js = normalizePaths(results.js)
    results.css = normalizePaths(results.css)
    results.twig = normalizePaths(results.twig)

    cb(results)
  })
}

const normalizePaths = paths => {
  for (let i = 0; i < paths.length; i++) {
    paths[i] = path.normalize(paths[i])
  }

  return paths
}
