const {log, shell: {rm, series}} = require('../utils/nps')

const description = 'Complete build with error-checking, transpiling, testing and bundling'

const nps = series(
  'echo',
  rm('build'),
  log.task('Transpiling TypeScript'),
  'nps tsc',
  log.task('Bundling module with Rollup'),
  'nps rollup',
  log.task('Cleaning up'),
  rm('build/esm'),
  log.success('Build complete'),
  'echo'
)

module.exports = {description, nps}
