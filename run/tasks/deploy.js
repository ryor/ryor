const description = 'Uploads code coverage to Codecov and publishes to NPM'

const run = [
  'log -w Uploading code coverage results to CodeCov',
  'codecov',
  'log -w Publishing to NPM',
  'shx cp -rf package.json README.md run/tools/npm/.npmrc build',
  'cd build',
  'npm publish'
]

module.exports = {description, run}
