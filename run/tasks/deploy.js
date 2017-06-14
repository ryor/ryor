const {log, shell: {cp, series}} = require('../utils/scripts')

const description = 'Verifies that tests pass and build completes succesfully, uploads code coverage to Codecov and publishes to NPM'

const run = series(
  'jest',
  'tsc',
  'rollup',
  log.task('Uploading code coverage results to CodeCov'),
  'codecov',
  log.task('Publishing to NPM'),
  cp('package.json README.md run/tools/npm/.npmrc build'),
  'cd build',
  'npm publish'
)

module.exports = {description, run}
