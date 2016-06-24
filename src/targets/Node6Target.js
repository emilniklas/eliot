'use strict'

var NodeTarget = require('./bases/NodeTarget')

function Node6Target () {
  this.name = 'NODE6'
}

Node6Target.prototype = new NodeTarget()

Node6Target.prototype.babelPlugins = function () {
  return ['transform-es2015-modules-commonjs']
}

Node6Target.prototype.asyncAwaitPlugins = function () {
  return ['syntax-async-functions', 'transform-async-to-generator']
}

module.exports = Node6Target
