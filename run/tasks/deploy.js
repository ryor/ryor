const {log, shell: {cp, series}} = require('../utils/scripts')

const description = 'Uploads code coverage to Codecov and publishes to NPM'

const run = series(
  log.task('Uploading code coverage results to CodeCov'),
  'codecov',
  log.task('Publishing to NPM'),
  cp('package.json README.md run/tools/npm/.npmrc build'),
  'cd build',
  'npm publish'
)

module.exports = {description, run}
