const {log, shell: {series}} = require('../utils')

module.exports = {
  test: {
    description: 'Transpiles TypeScript (including tests) into CommonJS modules for testing',
    script: series(
      log.task('Transpiling TypeScript into CommonJS modules'),
      'tsc -p run/tools/tsc.test.json'
    ),
  },
  build: {
    description: 'Transpiles TypeScript (excluding tests) into ES modules for bundling with Rollup',
    script: series(
      log.task('Transpiling TypeScript into ES modules'),
      'tsc -p run/tools/tsc.build.json'
    )
  }
}
