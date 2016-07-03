var Target = require('./Target')
var path = require('path')

module.exports = function (configuration, overrides) {
  var target = overrides.target || configuration.target
  var targets = configuration.targets || [{ target: target }]
  var commons = {
    jsx: overrides.jsx || configuration.jsx || false,
    decorators: overrides.decorators || configuration.decorators || false,
    entry: overrides.entry || configuration.entry,
    production: overrides.production || configuration.production,
    output: overrides.output || configuration.output,
    library: overrides.library || configuration.library || false
  }

  return targets.reduce(function (targets, target) {
    const library = target.library || commons.library
    return targets.concat({
      jsx: target.jsx || commons.jsx,
      decorators: target.decorators || commons.decorators,
      entry: target.entry || commons.entry,
      output: target.output || commons.output,
      production: target.production || commons.production,
      library: !library ? false : typeof library === 'string' ? library : path.basename(process.cwd()),
      target: Target.chooseTarget(target.target)
    })
  }, [])
}
