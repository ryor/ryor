const {log, shell: {rm, series}} = require('../utils/nps')

const description = 'Verifies that tests pass and build completes succesfully and publishes to NPM'

const nps = series(
  'nps jest.coverage',
  'codecov',
  'nps build',
  'npm publish'
)

module.exports = {description, nps}
