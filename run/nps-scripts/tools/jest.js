const {log, shell: {series}} = require('../utils')

module.exports = {
  description: 'Tests JavaScript using Jest',
  script: series(
    log.task('Testing JavaScript with Jest'),
    'echo',
    'jest build/cjs --coverage --verbose'
  )
}
