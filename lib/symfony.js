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
const workingDir = process.cwd()

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
  exports.getAssets(path.join(argument, '**'), files => {
    let css = []
    let js = []
    let todo = files.twig.length

    for (let i = 0; i < todo; i++) {
      const rr = fs.createReadStream(files.twig[i])
      let foundCss = 0
      let foundJs = 0
      rr.setEncoding('utf8')
      rr.on('readable', () => {
        if (!rr.read() || rr.read() === null)
          return

        let $ = cheerio.load(rr.read())
        let jsScript = $('script').attr('src')
        let cssScript = $('link').attr('href')

        if (jsScript) {
          foundJs++
          js.push(jsScript)
        }

        if (cssScript) {
          foundCss++
          css.push(cssScript)
        }
      })

      rr.on('end', () => {
        console.log(path.basename(files.twig[i]) + ' - Found ' + foundJs + ' JS files and ' + foundCss + ' CSS files')
        if (i === todo - 1) {
          log('OK', 'Done.')
          console.log('Total resources in use: ' + (css.length + js.length))
          console.log('CSS: ' + css.length)
          console.log('JS:  ' + js.length)
          cb({css, js})
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
