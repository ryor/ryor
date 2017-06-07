const {log, shell: {rm, series}} = require('../utils/nps')
const semver = require('../../package.json').version.split('.')
const version = `${semver[0]}.${semver[1]}.${Number(semver[2]) + 1}`

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
  log.task('Adding new tag to Git repository'),
  `git tag -a v${version} -m "Version ${version}"`,
  log.task('Pushing commit and tag to Github'),
  'git --follow-tags',
  'echo'
)

module.exports = {description, nps}
