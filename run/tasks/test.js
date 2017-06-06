const {log, shell: {series}} = require('../utils/nps')

const description = 'Checks TypeScript for errors with TSLint and then tests TypeScript with Jest'

const nps = series(
  'echo',
  log.task('Checking TypeScript for errors with TSLint'),
  'nps tslint',
  log.task('Testing TypeScript with Jest'),
  'echo',
  'nps jest.verbose',
  'echo',
  log.success('All tests passed'),
  'echo'
)

module.exports = {description, nps}
