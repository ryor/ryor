const {log, shell: {rm, series}} = require('../utils/nps')

const description = 'Verifies that tests pass and build completes succesfully and publishes to NPM'

const nps = series(
  'nps tslint jest.quiet build',
  'npm publish'
)

module.exports = {description, nps}
