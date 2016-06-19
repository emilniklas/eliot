var Config = require('./Config')
var webpack = require('webpack')
var tempfile = require('tempfile')
var fork = require('child_process').fork
var report = require('./report')

module.exports = function (target, argv, watch, verbose) {
  target.output = tempfile('.js')
  target.target = Config.Target.NODE6
  var config = new Config(target).build()
  verbose && console.log(config)
  var compiler = webpack(config)
  if (watch) {
    var forked
    compiler.watch({}, function (err, stats) {
      if (err) {
        console.error(err)
        console.log('Waiting for changes...')
        return
      }
      report(target, stats, true)
      if (forked) {
        forked.on('exit', function () {
          forked = fork(target.output, argv)
        })
        return forked.kill()
      }
      forked = fork(target.output, argv)
    })
  } else {
    compiler.run(function (err) {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      return fork(target.output, argv)
    })
  }
}
