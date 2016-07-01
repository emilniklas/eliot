var Config = require('./Config')
var webpack = require('webpack')
var tempfile = require('tempfile')
var spawn = require('child_process').spawn
var report = require('./report')
var path = require('path')

function spawnProcess (executable, args, onClose) {
  executable = path.resolve(process.cwd(), 'node_modules', '.bin', executable)
  var runner = spawn(executable, args, {
    stdio: 'inherit'
  })
  runner.on('close', onClose)
}

module.exports = function (targets, executable, watch, verbose) {
  var configs = targets.map(function (target) {
    target.output = tempfile('.js')
    target.target = Config.Target.NODE6
    target.development = true
    var conf = new Config(target).build()
    delete conf.output.library
    delete conf.output.libraryTarget
    return [target.output, conf, target]
  })
  var configTargets = configs.map(function (kv) { return kv[1] })
  var configTargetFiles = configs.map(function (kv) { return kv[0] })
  verbose && console.log(configTargets)
  var compiler = webpack(configTargets)

  if (watch) {
    compiler.watch({}, function (err, stats) {
      var output = stats.compilation.assets[Object.keys(stats.compilation.assets)[0]].existsAt
      var target = configs.filter(function (kv) { return kv[0] === output })[0][2]
      if (err) {
        console.error(err)
        console.log('Waiting for changes...')
        return
      }
      report(target, stats, true)
      spawnProcess(executable, [output], function () {})
    })
  } else {
    compiler.run(function (err) {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      spawnProcess(executable, configTargetFiles, process.exit)
    })
  }
}
