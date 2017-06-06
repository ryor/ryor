const {log, shell: {rm, series}} = require('../utils/nps')

const description = 'Checks TypeScript for errors with TSLint and then tests TypeScript with Jest'

const nps = series(
  'echo',
  log.task('Checking TypeScript for errors with TSLint'),
  'nps tslint',
  log.task('Testing TypeScript with Jest'),
  'echo',
  'nps jest.coverage',
  rm('coverage'),
  'echo',
  log.success('All tests passed'),
  'echo'
)

module.exports = {description, nps}
