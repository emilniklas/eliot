var Target = require('../config').Target
var path = require('path')

module.exports = function (configuration, overrides) {
  var target = overrides.target || configuration.target || Target.ES3
  var targets = configuration.targets || [{ target: target }]
  var commons = {
    jsx: overrides.jsx || configuration.jsx || false,
    decorators: overrides.decorators || configuration.decorators || false,
    entry: overrides.entry || configuration.entry,
    development: !(overrides.production || configuration.production || !!configuration.development),
    output: overrides.output || configuration.output,
    library: overrides.library || configuration.library || false,
  }

  return targets.reduce(function (targets, target) {
    const library = target.library || commons.library
    return targets.concat({
      jsx: target.jsx || commons.jsx,
      decorators: target.decorators || commons.decorators,
      entry: target.entry || commons.entry,
      output: target.output || commons.output,
      development: target.development || commons.development,
      library: !library ? false : typeof library === 'string' ? library : path.basename(process.cwd()),
      target: target.target
    })
  }, [])
}
