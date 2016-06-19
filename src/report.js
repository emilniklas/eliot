var chalk = require('chalk')
var path = require('path')

module.exports = function report (config, stats, noOutput) {
  var duration = stats.endTime - stats.startTime
  var input = path.relative(process.cwd(), config.entry)
  var output = path.relative(process.cwd(), config.output)
  var annotations = []
  if (config.development) {
    annotations.push(chalk.yellow('DEV'))
  } else {
    annotations.push(chalk.yellow('PROD'))
  }
  if (config.jsx) {
    annotations.push(chalk.yellow('JSX'))
  }
  if (config.decorators) {
    annotations.push(chalk.yellow('@'))
  }
  console.log(
    chalk.green(duration + 'ms'),
    chalk.gray('[') +
    annotations.join(chalk.gray(', ')) +
    chalk.gray(']'),
    chalk.cyan(input),
    chalk.gray('›'),
    chalk.yellow(config.target.toUpperCase()),
    noOutput
     ? chalk.magenta('[temp]')
     : chalk.cyan(output),
    chalk.gray(stats.hash)
  )
}
