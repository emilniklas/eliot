'use strict'

var readdirSync = require('fs').readdirSync
var resolve = require('path').resolve

function NodeTarget () {}

NodeTarget.prototype.moduleSystem = function () {
  return 'commonjs2'
}

NodeTarget.prototype.babelPresets = function () {
  return []
}

NodeTarget.prototype.babelPlugins = function () {
  return []
}

NodeTarget.prototype.webpackTarget = function () {
  return 'node'
}

NodeTarget.prototype.webpackPlugins = function (env) {
  return []
}

NodeTarget.prototype.asyncAwaitPlugins = function () {
  return []
}

NodeTarget.prototype.webpackExternals = function () {
  var externals = {}
  var deps
  try {
    deps = readdirSync(resolve(process.cwd(), 'node_modules'))
  } catch (e) {
    deps = readdirSync(resolve(process.cwd(), '..'))
  }
  deps
    .filter(function (x) {
      return ['.bin'].indexOf(x) === -1
    })
    .forEach(function (mod) {
      externals[mod] = 'commonjs ' +
        resolve(process.cwd(), 'node_modules', mod)
        .replace(/node_modules.*node_modules/, 'node_modules')
    })
  return externals
}

NodeTarget.prototype.optimize = function (inProduction) {
  return false
}

module.exports = NodeTarget
