const {log, shell: {mv, rm, series}} = require('../utils/nps')

const description = 'Complete build with error-checking, transpiling, testing and bundling'

const nps = series(
  'echo',
  rm('build'),
  log.task('Transpiling TypeScript'),
  'nps tsc.commands tsc.lib',
  log.task('Bundling module with Rollup'),
  'nps rollup',
  log.task('Cleaning up'),
  rm('build/index.js build/utils dist'),
  mv('build', 'dist'),
  log.success('Build complete'),
  'echo'
)

module.exports = {description, nps}
