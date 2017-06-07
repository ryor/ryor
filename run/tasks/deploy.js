const {log, shell: {series}} = require('../utils/nps')

const description = 'Verifies that tests pass and build completes succesfully and publishes to NPM'

const nps = series(
  'echo',
  log('Uploading code coverage results to CodeCov'),
  'codecov',
  log('Publishing to NPM'),
  cp('package.json', 'run/tools/npm/.npmrc', 'build'),
  'cd build',
  'npm publish',
  'echo'
)

module.exports = {description, nps}
