'use strict'

var nodeExternals = require('webpack-node-externals')
var DefinePlugin = require('webpack').DefinePlugin

function WebTarget () {}

WebTarget.prototype.moduleSystem = function (isLibrary) {
  return isLibrary ? 'commonjs2' : 'var'
}

WebTarget.prototype.babelPresets = function () {
  return []
}

WebTarget.prototype.babelPlugins = function () {
  return []
}

WebTarget.prototype.webpackTarget = function () {
  return 'web'
}

WebTarget.prototype.webpackPlugins = function (env, isLibrary) {
  const defines = {}
  defines.process = {}
  defines.process.env = {}

  defines.process.env.ELIOT_TARGET = isLibrary
    ? 'process.env.ELIOT_TARGET'
    : JSON.stringify(this.name)

  defines.process.env.NODE_ENV = isLibrary
    ? 'process.env.NODE_ENV'
    : env.devMode ? '"development"' : '"production"'

  defines.process.env.ELIOT_DEV_MODE = isLibrary
    ? 'process.env.ELIOT_DEV_MODE'
    : env.devMode ? 'true' : 'false'

  defines.process.env.ELIOT_PRODUCTION_MODE = isLibrary
    ? 'process.env.ELIOT_PRODUCTION_MODE'
    : env.productionMode ? 'true' : 'false'

  defines.process.env.ELIOT_SERVER = isLibrary
    ? 'process.env.ELIOT_SERVER'
    : 'false'

  defines.process.env.ELIOT_BROWSER = isLibrary
    ? 'process.env.ELIOT_BROWSER'
    : 'true'

  return [
    new DefinePlugin(defines)
  ]
}

WebTarget.prototype.webpackExternals = function (isLibrary) {
  if (isLibrary) {
    return [nodeExternals()]
  }
}
WebTarget.prototype.node = function () {}

WebTarget.prototype.optimize = function (inProduction) {
  return inProduction
}

module.exports = WebTarget
