const {log, shell: {rm, series}} = require('../utils')

const description = 'Transpiles TypeScript into ES modules, bundles ES modules with Rollup and adds autorun function call'

const run = series(
  rm('build'),
  log.task('Transpiling TypeScript'),
  'tsc',
  log.task('Bundling module with Rollup'),
  'rollup',
  'autorun',
  log.task('Cleaning up'),
  rm('build/esm'),
  log.success('Build complete')
)

module.exports = {description, run}
