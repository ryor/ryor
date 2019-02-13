const { transpile } = require('typescript')

const compilerOptions = {
  ...require('../tsc/config.json').compilerOptions,
  module: 'CommonJS'
}

module.exports = {
  process: function (source, path) {
    if (path.endsWith('.ts')) return transpile(source, compilerOptions, path)

    return source
  }
}
