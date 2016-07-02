require('core-js/es6')
require('core-js/es7')
require('isomorphic-fetch/fetch-npm-browserify')

window.__fetch = window.fetch
window.global = window
