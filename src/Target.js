'use strict'

var Node6Target = require('./targets/Node6Target')
var ES6Target = require('./targets/ES6Target')
var ES5Target = require('./targets/ES5Target')
var ES3Target = require('./targets/ES3Target')

var targets = {
  ES3: new ES3Target(),
  ES5: new ES5Target(),
  ES6: new ES6Target(),
  NODE6: new Node6Target()
}

exports.targets = targets

exports.chooseTarget = function chooseTarget (target) {
  if (typeof target === 'object') { return target }

  switch (String(target).toUpperCase()) {
    case 'NODE6':
    case 'NODE':
      return targets.NODE6

    case 'ES3':
    case 'LEGACY':
    case 'FALLBACK':
      return targets.ES3

    case 'ES5':
    case 'WEB':
    case 'STANDARD':
    case 'DEFAULT':
    case 'NULL':
    case 'UNDEFINED':
      return targets.ES5

    case 'ES6':
    case 'HARMONY':
    case 'ES2015':
    case 'ESNEXT':
    case 'NEXT':
    case 'NEXTGEN':
      return targets.ES6

    default:
      throw new Error('Could not find a target like ' + target)
  }
}
