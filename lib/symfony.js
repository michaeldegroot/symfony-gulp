'use strict'

const async      = require('async')
const glob       = require('glob')
const path       = require('path')
const util       = require('./util.js')
const log        = util.log
const workingDir = util.directory()
const fs         = require('fs')
const readline   = require('readline')
const stream     = require('stream')
const cheerio    = require('cheerio')

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

// Search through all templates looking for js and css files
exports.getResourcesInUse = (argument, cb) => {
  exports.getAssets(path.join(argument, '**'), files => {
    let css = []
    let js = []
    let todo = files.twig.length
    if (todo === 0)
      log('FAIL', 'No files found\nDirectory: ' + path.join(workingDir, 'src', argument, '**'))

    for (let i = 0; i < todo; i++) {
      fs.readFile(files.twig[i], 'utf8', function(err, contents) {
        if (err)
          throw new Error(err)

        // Use cheerio to find the js and css links
        let $ = cheerio.load(contents)
        let jsScript = $('script').attr('src')
        let cssScript = $('link').attr('href')

        if(jsScript) console.log(jsScript)

        if (jsScript && jsScript.indexOf('http') === -1 && jsScript.indexOf('.js') >= 0 && jsScript.indexOf('//') === -1) {
          js.push(jsScript.replace('{{ asset(\'', '').replace('\') }}', ''))
        }

        if (cssScript && cssScript.indexOf('http') === -1 && cssScript.indexOf('.css') >= 0) {
          css.push(cssScript.replace('{{ asset(\'', '').replace('\') }}', ''))
        }

        // Loop is done
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
