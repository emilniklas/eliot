#!/usr/bin/env node
'use strict'

var program = require('commander')
var eliot = require('../package.json')
var path = require('path')
var fs = require('fs')
var normalize = require('../src/normalize')
var Target = require('../config').Target
var glob = require('glob').sync

var run = require('../src/run')
var build = require('../src/build')

program
  .version(eliot.version)
  .usage('[file] [options]')
  .option('--decorators', 'Add support for decorators')
  .option('--jsx', 'Add support for JSX')
  .option('--config [file]', 'Use a specific configuration file', 'eliot.config.js')
  .option('--target [target]', 'Target to build to [' + Object.keys(Target).map(function (k) { return Target[k] }).join('|') + ']')
  .option('--entry [file]', 'Entry file')
  .option('--output [file]', 'Output file')
  .option('-p, --production', 'Production mode')
  .option('-w, --watch', 'Watch the entry points and compile automatically')

program.on('--help', function () {
  console.log('  Commands:')
  console.log('')
  console.log('    eliot build --entry [file] --output [file] [options]')
  console.log('    eliot test --using [executable] [options]')
  console.log('')
})

var runArgsPos = process.argv.indexOf('--')
var runArgs = runArgsPos === -1 ? [] : process.argv.slice(runArgsPos + 1)
if (runArgsPos !== -1) {
  process.argv = process.argv.slice(0, runArgsPos)
}

program.parse(process.argv)

;(function (args, options) {
  var config = options.config
  var configFile = path.resolve(process.cwd(), config)

  var configuration = {}
  if (fs.existsSync(configFile)) {
    require('babel-register')({
      plugins: ['transform-es2015-modules-commonjs']
    })

    configuration = require(configFile)
    configuration = configuration.default || configuration

    if (Object.prototype.toString.call(configuration) === '[object Array]') {
      configuration = { targets: configuration }
    }
  }

  var targets = normalize(configuration, options)

  if (args[0] === 'test') {
    var targets = glob(path.resolve(process.cwd(), 'test', '**', '*.js'))
      .map(function (file) {
        return normalize(configuration, {
          target: Target.NODE6,
          entry: file
        })[0]
      })
    return console.log('test!', targets)
  }

  if (args.length === 0 && targets.length === 1 && !targets[0].entry) {
    console.log('Add at least one entry point')
    return process.exit(1)
  }

  if (args[0] === 'build') {
    return build(targets, !!program.watch)
  }

  var target = targets[0]
  target.entry = args[0] || target.entry
  run(target, runArgs, !!program.watch)
})(program.args, program)
