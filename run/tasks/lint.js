const {log, shell: {series}} = require('../utils/scripts')

const description = 'Checks TypeScript for errors with TSLint'

const run = series(
  log.task('Checking TypeScript for errors with TSLint'),
  'tslint',
  log.success('No errors found.')
)

module.exports = {description, run}
