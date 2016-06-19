'use strict'

const async      = require('async')
const glob       = require('glob')
const log        = require('./log.js').log
const path       = require('path')
const util       = require('./util.js')
const fs         = require('fs')
const readline   = require('readline')
const stream     = require('stream')
const cheerio    = require('cheerio')
const workingDir = require('./workingdir').directory()

// Load and check the symfony-gulp.json for errors
exports.getConfig = cb => {
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

exports.getResourcesInUse = (argument, cb) => {
  console.log(argument)
  exports.getAssets(path.join(argument, '**'), files => {
    let css = []
    let js = []
    let todo = files.twig.length
    if (todo === 0)
      log('FAIL', 'No files found')

    for (let i = 0; i < todo; i++) {
      fs.readFile(files.twig[i], 'utf8', function(err, contents) {
        if (err)
          throw new Error(err)

        let $ = cheerio.load(contents)
        let jsScript = $('script').attr('src')
        let cssScript = $('link').attr('href')

        if (jsScript && jsScript.indexOf('http') === -1 && path.extname(jsScript) === '.js') {
          js.push(jsScript)
        }

        if (cssScript && cssScript.indexOf('http') === -1 && path.extname(cssScript) === '.css') {
          css.push(cssScript)
        }

        if (i === todo - 1) {
          cb(null, {css, js})
        }
      })
    }
  })
}

// How to get all symfony assets from a specific bundle
exports.getAssets = (bundle, cb) => {
  // If no bundle is defined, we get ALL files
  if (!bundle)
    bundle = '**'

console.log(workingDir, 'src', bundle, '*.css')

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
