const {log, shell: {rm, series}} = require('../utils/nps')

const description = 'Verifies that tests pass and build completes succesfully, increments package.json patch numbers, commits changes to Git repository and pushes commit to Github'

const nps = series(
  'echo',
  log.task('Checking TypeScript for errors with TSLint'),
  'nps tslint',
  log.task('Testing TypeScript with Jest'),
  'echo',
  'nps jest',
  'echo',
  'nps build patch',
  'git add --all',
  'git commit',
  'git push'
)

module.exports = {description, nps}
