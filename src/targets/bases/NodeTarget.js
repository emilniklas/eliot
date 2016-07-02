'use strict'

var nodeExternals = require('webpack-node-externals')

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
  return [nodeExternals()]
}

NodeTarget.prototype.node = function () {
  return {
    __dirname: true,
    __filename: true
  }
}

NodeTarget.prototype.optimize = function (inProduction) {
  return false
}

module.exports = NodeTarget
