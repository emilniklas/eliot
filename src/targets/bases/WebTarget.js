'use strict'

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

WebTarget.prototype.webpackPlugins = function (env) {
  return [
    new DefinePlugin({
      process: {
        env: {
          NODE_ENV: env.devMode ? '"development"' : '"production"',
          ELIOT_TARGET: JSON.stringify(this.name),
          ELIOT_DEV_MODE: env.devMode ? 'true' : 'false',
          ELIOT_PRODUCTION_MODE: env.productionMode ? 'true' : 'false',
          ELIOT_SERVER: 'false',
          ELIOT_BROWSER: 'true'
        }
      }
    })
  ]
}

WebTarget.prototype.webpackExternals = function () {}
WebTarget.prototype.node = function () {}

WebTarget.prototype.optimize = function (inProduction) {
  return inProduction
}

module.exports = WebTarget
