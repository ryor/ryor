const {log, shell: {series}} = require('../utils/nps')

const description = 'Checks TypeScript for errors with TSLint'

const nps = series(
  'echo',
  log.task('Checking TypeScript for errors with TSLint'),
  'nps tslint',
  log.success('No errors found.'),
  'echo'
)

module.exports = {description, nps}
