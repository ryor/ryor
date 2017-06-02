const {log, shell: {rm, series}} = require('../utils')

const externals = ['chalk', 'fs', 'minimist', 'nps',  'os', 'path'].join(',')

module.exports = {
  description: 'Bundles ES modules into single CommonJS module with Rollup',
  script: series(
    log.task('Bundling JavaScript with Rollup'),
    `rollup -e ${externals} -f cjs -o build/dist/ryor.js build/esm/index.js`
  )
}
