var path = require('path')
var webpack = require('webpack')
var fs = require('fs')

function Config (config) {
  this._target = config.target
  this._devMode = config.development || !!process.env.NODE_ENV === 'development'
  this._productionMode = !this._devMode
  this._entry = config.entry
  this._library = config.library
  this._output = path.resolve(config.output)
  this._package = require(path.resolve(process.cwd(), 'package.json'))
  this._package.name = this._package.name || path.basename(process.cwd())
  this._jsx = config.jsx
    ? config.jsx === true ? 'react' : config.jsx
    : false
  this._useDecorators = !!config.decorators
}

Config.Target = {
  ES3: 'es3',
  ES5: 'es5',
  ES6: 'es6',
  NODE6: 'node6'
}

Config.prototype.build = function () {
  return {
    entry: this._buildEntry(),
    output: this._webpackOutput(),
    module: this._module(),
    target: this._webpackTarget(),
    devtool: this._devtool(),
    plugins: this._plugins(),
    externals: this._externals()
  }
}

Config.prototype._buildEntry = function () {
  var main = path.resolve(process.cwd(), this._entry)
  var jsx = this._jsx === 'react'
    ? [path.resolve(__dirname, 'preambles', 'react.js')]
    : []
  return [
    path.resolve(__dirname, 'preambles', this._target + '.js')
  ].concat(jsx).concat(main)
}

Config.prototype._webpackOutput = function () {
  return {
    path: path.dirname(this._output),
    filename: path.basename(this._output),
    pathinfo: this._devMode,
    library: this._library,
    libraryTarget: this._libraryTarget(),
    umdNamedDefine: true
  }
}

Config.prototype._libraryTarget = function () {
  switch (this._target) {
    case Config.Target.NODE6:
      return 'commonjs2'
    case Config.Target.ES6:
    case Config.Target.ES5:
    case Config.Target.ES3:
      return 'var'
  }
}

Config.prototype._module = function () {
  return {
    loaders: [
      this._babel(),
      this._json(),
      // Fixes weird bug for some reason
      { test: /\.d\.ts$/, loader: 'json' }
    ]
  }
}

Config.prototype._json = function () {
  return {
    test: /\.json$/,
    loader: 'json'
  }
}

Config.prototype._babel = function () {
  return {
    test: /\.js$/,
    exclude: new RegExp(`(node_modules(?![\\/\\\\]eliot)(?![\\/\\\\]${this._package.name})|bower_components)`),
    loader: 'babel',
    query: {
      presets: this._babelPresets(),
      plugins: this._babelPlugins()
    }
  }
}

Config.prototype._babelPresets = function () {
  switch (this._target) {
    case Config.Target.NODE6:
    case Config.Target.ES6:
      return []
    case Config.Target.ES5:
    case Config.Target.ES3:
      return ['es2015']
  }
}

Config.prototype._babelPlugins = function () {
  var common = ['transform-runtime']
  var asyncAwait = this._asyncAwaitPlugins()
  var jsx = this._jsx ? this._babelJSX() : []

  if (this._useDecorators) {
    common.push('transform-decorators-legacy')
  }

  switch (this._target) {
    case Config.Target.NODE6:
    case Config.Target.ES6:
      return common
        .concat(asyncAwait)
        .concat(jsx)
        .concat(['transform-es2015-modules-commonjs'])

    case Config.Target.ES5:
    case Config.Target.ES3:
      return common
        .concat(asyncAwait)
        .concat(jsx)
  }
}

Config.prototype._asyncAwaitPlugins = function () {
  switch (this._target) {
    case Config.Target.NODE6:
    case Config.Target.ES6:
      return ['syntax-async-functions', 'transform-async-to-generator']
    case Config.Target.ES5:
    case Config.Target.ES3:
      return ['syntax-async-functions', 'transform-regenerator']
  }
}

Config.prototype._babelJSX = function () {
  return [
    ['transform-react-jsx', {
      pragma: '__' + this._jsx
    }],
    'transform-flow-strip-types',
    'syntax-flow',
    'syntax-jsx',
    'transform-react-display-name'
  ]
}

Config.prototype._webpackTarget = function () {
  switch (this._target) {
    case Config.Target.NODE6:
      return 'node'
    case Config.Target.ES6:
    case Config.Target.ES5:
    case Config.Target.ES3:
      return 'web'
  }
}

Config.prototype._devtool = function () {
  if (this._devMode) {
    return 'inline-source-map'
  }
}

Config.prototype._plugins = function () {
  switch (this._target) {
    case Config.Target.NODE6:
      return this._optimize()
    case Config.Target.ES3:
    case Config.Target.ES5:
    case Config.Target.ES6:
      return this._optimize().concat([
        new webpack.DefinePlugin({
          process: {
            env: {
              NODE_ENV: this._devMode ? '"development"' : '"production"',
              ELIOT_TARGET: JSON.stringify(this._target),
              ELIOT_DEV_MODE: this._devMode ? 'true' : 'false',
              ELIOT_PRODUCTION_MODE: this._productionMode ? 'true' : 'false',
              ELIOT_SERVER: 'false',
              ELIOT_BROWSER: 'true'
            }
          }
        })
      ])
  }
}

Config.prototype._optimize = function () {
  if (this._devMode) { return [] }

  return [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}

Config.prototype._externals = function () {
  switch (this._target) {
    case Config.Target.ES3:
    case Config.Target.ES5:
    case Config.Target.ES6:
      return void 0
    case Config.Target.NODE6:
      var externals = {}
      var deps
      try {
        deps = fs.readdirSync(path.resolve(process.cwd(), 'node_modules'))
      } catch (e) {
        deps = fs.readdirSync(path.resolve(process.cwd(), '..'))
      }
      deps
        .filter(function (x) {
          return ['.bin'].indexOf(x) === -1
        })
        .forEach(function (mod) {
          externals[mod] = 'commonjs ' + path
            .resolve(process.cwd(), 'node_modules', mod)
            .replace(/node_modules.*node_modules/, 'node_modules')
        })
      return externals
  }
}

module.exports = Config
