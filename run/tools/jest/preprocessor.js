const transpileES = require('@babel/core').transform
const transpileTS = require('typescript').transpile

const esOptions = {
  babelrc: false,
  compact: false,
  plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')]
}

const tsOptions = {
  ...require('../tsc/config.json').compilerOptions,
  inlineSourceMap: true,
  module: 'CommonJS'
}

module.exports = {
  process: (source, path) => {
    if (path.endsWith('.ts')) return transpileTS(source.replace(/^const/gm, 'export const').replace(/^function/gm, 'export function'), tsOptions, path)

    if (path.endsWith('.js') && path.includes('test-projects')) return transpileES(source, esOptions).code

    return source
  }
}
