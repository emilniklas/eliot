'use strict'

var WebTarget = require('./bases/WebTarget')

function ES6Target () {
  this.name = 'ES6'
}

ES6Target.prototype = new WebTarget()

ES6Target.prototype.babelPlugins = function () {
  return ['transform-es2015-modules-commonjs']
}

ES6Target.prototype.asyncAwaitPlugins = function () {
  return ['syntax-async-functions', 'transform-async-to-generator']
}

module.exports = ES6Target
