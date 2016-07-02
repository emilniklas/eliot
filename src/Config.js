var path = require('path')
var webpack = require('webpack')
var Target = require('./Target')
var fs = require('fs')

function Config (config) {
  this._target = Target.chooseTarget(config.target)
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

Config.Target = Target.targets

Config.prototype.build = function () {
  return {
    entry: this._buildEntry(),
    output: this._webpackOutput(),
    module: this._module(),
    target: this._target.webpackTarget(),
    devtool: this._devtool(),
    plugins: this._plugins(),
    externals: this._target.webpackExternals(),
    resolve: this._resolve(),
    node: this._target.node()
  }
}

Config.prototype._buildEntry = function () {
  var main = path.resolve(process.cwd(), this._entry)
  var jsx = this._jsx === 'react'
    ? ['eliot/src/preambles/react.js']
    : []
  return [
    'eliot/src/preambles/', this._target.name + '.js'
  ].concat(jsx).concat(main)
}

Config.prototype._webpackOutput = function () {
  return {
    path: path.dirname(this._output),
    filename: path.basename(this._output),
    pathinfo: this._devMode,
    library: this._library,
    libraryTarget: this._target.moduleSystem(!!this._library),
    umdNamedDefine: true
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
      presets: this._target.babelPresets(),
      plugins: this._babelPlugins()
    }
  }
}

Config.prototype._babelPlugins = function () {
  var common = ['transform-runtime']
  var asyncAwait = this._target.asyncAwaitPlugins()
  var jsx = this._jsx ? this._babelJSX() : []

  if (this._useDecorators) {
    common.push('transform-decorators-legacy')
  }

  return common
    .concat(asyncAwait)
    .concat(jsx)
    .concat(this._target.babelPlugins())
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

Config.prototype._devtool = function () {
  if (this._devMode) {
    return 'inline-source-map'
  }
}

Config.prototype._plugins = function () {
  return this._optimize().concat(this._target.webpackPlugins({
    devMode: this._devMode,
    productionMode: this._productionMode
  }))
}

Config.prototype._optimize = function () {
  if (this._devMode || !this._target.optimize(this._productionMode)) { return [] }

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

Config.prototype._resolve = function () {
  var packageFile = path.resolve(process.cwd(), 'package.json')
  if (!fs.existsSync(packageFile)) {
    return void 0
  }

  var pack = require(packageFile)
  if (!pack.name) {
    return void 0
  }

  var resolve = { alias: {} }
  resolve.alias[pack.name] = process.cwd()
  return resolve
}

module.exports = Config
