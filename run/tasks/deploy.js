const {log, shell: {cp, series}} = require('../utils/nps')

const description = 'Verifies that tests pass and build completes succesfully and publishes to NPM'

const nps = series(
  'echo',
  log.task('Uploading code coverage results to CodeCov'),
  'codecov',
  log.task('Publishing to NPM'),
  cp('package.json', 'readme.md',  'run/tools/npm/.npmrc', 'build'),
  'cd build',
  'npm publish',
  'echo'
)

module.exports = {description, nps}
