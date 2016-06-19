var Target = require('../config').Target

module.exports = function (configuration, overrides) {
  var target = overrides.target || configuration.target || Target.ES3
  var targets = configuration.targets || [{ target: target }]
  var commons = {
    jsx: overrides.jsx || configuration.jsx || false,
    decorators: overrides.decorators || configuration.decorators || false,
    entry: overrides.entry || configuration.entry,
    development: !overrides.production || configuration.development || true,
    output: overrides.output || configuration.output
  }

  return targets.reduce(function (targets, target) {
    return targets.concat({
      jsx: target.jsx || commons.jsx,
      decorators: target.decorators || commons.decorators,
      entry: target.entry || commons.entry,
      output: target.output || commons.output,
      development: target.development || commons.development,
      target: target.target
    })
  }, [])
}
