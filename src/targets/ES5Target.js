'use strict'

var WebTarget = require('./bases/WebTarget')

function ES5Target () {
  this.name = 'ES5'
}

ES5Target.prototype = new WebTarget()

ES5Target.prototype.babelPresets = function () {
  return ['es2015']
}

ES5Target.prototype.asyncAwaitPlugins = function () {
  return ['syntax-async-functions', 'transform-regenerator']
}

module.exports = ES5Target
