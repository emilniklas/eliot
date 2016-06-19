var Config = require('./Config')
var webpack = require('webpack')
var path = require('path')
var report = require('./report')

function reportMulti (config, err, stats) {
  if (err) {
    return console.error(err)
  }
  if (!stats.stats) {
    return report(config, stats)
  }
  stats.stats.forEach(function (stats) {
    report(config, stats)
  })
}

module.exports = function (targets, watch) {
  var allConfig = {}
  targets.forEach(function (target) {
    if (!target.output) {
      console.error('Entry point ' + target.entry + ' must have an output')
      process.exit(1)
    }
    var config = new Config(target).build()
    var id = path.resolve(target.output)
    allConfig[id] = [target, config]
  })
  var webpackConfigs = Object.keys(allConfig).map(function (k) {
    return allConfig[k][1]
  })
  var compiler = webpack(webpackConfigs)
  var report = function (err, stats) {
    var id = stats.compilation.assets[Object.keys(stats.compilation.assets)[0]].existsAt
    if (!id) { return }
    var config = allConfig[id][0]
    reportMulti(config, err, stats)
  }
  if (!watch) {
    return compiler.run(report)
  }
  compiler.watch({}, report)
}
