const {log, shell: {mkdir, mv, rm, series}} = require('./utils')

module.exports = {
  default: {
    description: 'Complete build with error-checking, transpiling, testing and bundling',
    script: series(
      'echo',
      rm('build coverage'),
      'nps build._test tools.jest',
      rm('coverage'),
      'echo',
      'nps build._bundle build._dist',
      log.success('Build complete'),
      'echo'
    )
  },
  _test: series(
    'nps tools.tslint tools.tsc.test'
  ),
  _bundle: series(
    'nps tools.tsc.build tools.rollup'
  ),
  _dist: series(
    mv('build/cjs/commands', 'build/dist/commands'),
    rm('dist'),
    mv('build/dist', 'dist'),
    rm('build')
  )
}
