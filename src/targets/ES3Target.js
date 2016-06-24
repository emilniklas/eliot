'use strict'

var WebTarget = require('./bases/WebTarget')

function ES3Target () {
  this.name = 'ES3'
}

ES3Target.prototype = new WebTarget()

ES3Target.prototype.babelPresets = function () {
  return ['es2015']
}

ES3Target.prototype.asyncAwaitPlugins = function () {
  return ['syntax-async-functions', 'transform-regenerator']
}

module.exports = ES3Target
