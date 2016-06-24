var chalk = require('chalk')
var path = require('path')
var fs = require('fs')

module.exports = function report (config, stats, noOutput) {
  var duration = stats.endTime - stats.startTime
  var input = path.relative(process.cwd(), config.entry)
  var output = path.relative(process.cwd(), config.output)
  var annotations = []
  if (config.jsx) {
    annotations.push(chalk.yellow('JSX'))
  }
  if (config.decorators) {
    annotations.push(chalk.yellow('@'))
  }
  const prefix = annotations.length > 0
    ? chalk.gray('[') + annotations.join(chalk.gray(', ')) + chalk.gray(']') + ' '
    : ''
  console.log(
    prefix + chalk.cyan(input),
    chalk.gray('▸'),
    chalk.yellow(config.target.name + (config.development ? '-dev' : '')),
    noOutput
      ? chalk.yellow('↺ ')
      : chalk.cyan(output),
    '',
    chalk.bold(formatDuration(duration)),
    chalk.bold(formatSize(fs.statSync(output).size, config.development)),
    chalk.gray(' 𐄹 ' + stats.hash)
  )
}

function formatDuration (duration) {
  var color = chooseColorForDuration(duration)
  return color(duration + 'ms')
}

function chooseColorForDuration (duration) {
  if (duration > 5000) {
    return chalk.red
  } else if (duration > 2000) {
    return chalk.yellow
  } else {
    return chalk.green
  }
}

function formatSize (size, inDevMode) {
  var color = chooseColorForSize(size, inDevMode)
  if (size > 1024 * 1024) {
    return color(Math.floor(size / 1024 / 1024 * 10) / 10 + 'MB')
  } else if (size > 1024) {
    return color(Math.floor(size / 1024) + 'kB')
  } else {
    return color(size + 'B')
  }
}

function chooseColorForSize (size, inDevMode) {
  if (inDevMode) {
    return chalk.blue
  }
  var kB = 1024
  if (size > 800 * kB) {
    return chalk.red
  } else if (size > 500 * kB) {
    return chalk.yellow
  } else if (size > 300 * kB) {
    return chalk.blue
  } else {
    return chalk.green
  }
}
