const {log, shell: {rm, series}} = require('../utils/scripts')

const description = 'Checks TypeScript for errors with TSLint and then tests TypeScript with Jest'

const run = series(
  log.task('Checking TypeScript for errors with TSLint'),
  'tslint',
  log.task('Testing TypeScript with Jest'),
  'echo',
  'jest',
  'echo',
  log.success('All tests passed')
)

module.exports = {description, run}
