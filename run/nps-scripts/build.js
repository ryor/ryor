const {log, shell: {mkdir, mv, rm, series}} = require('./utils')

module.exports = {
  description: 'Complete build with error-checking, transpiling, testing and bundling',
  script: series(
    'echo',
    rm('build'),
    'nps tools.tslint tools.tsc.test tools.jest.minimal',
    'echo',
    'nps tools.tsc.build tools.rollup',
    mv('build/cjs/commands', 'build/dist/commands'),
    rm('dist'),
    mv('build/dist', 'dist'),
    rm('build'),
    log.success('Build complete'),
    'echo'
  )
}
