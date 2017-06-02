const {log, shell: {rm, series}} = require('../utils')
const message = 'Testing JavaScript with Jest'

module.exports = {
  minimal: {
    description: 'Tests JavaScript using Jest with minimal output',
    script: series(
      log.task(message),
      'echo',
      'jest build/cjs'
    )
  },
  verbose: {
    description: 'Tests JavaScript using Jest with verbose output and coverage results',
    script: series(
      log.task(message),
      'echo',
      'jest build/cjs --coverage --verbose',
      rm('coverage')
    )
  }
}
