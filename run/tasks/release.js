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
  log.task('Confirming build completes succesfully'),
  'nps tsc rollup',
  rm('build'),
  log.task('Updating package.json file'),
  'nps patch',
  log.task('Committing changes to Git repository'),
  'git add --all',
  'git commit',
  log.task('Pushing changes to Github'),
  'git push',
  'echo'
)

module.exports = {description, nps}
