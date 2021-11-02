const esOptions = {
  babelrc: false,
  plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
  sourceMaps: 'inline'
}

const tsOptions = {
  ...require('../tsc/config.json').compilerOptions,
  inlineSourceMap: true,
  module: 'CommonJS'
}

module.exports = {
  process: (source, path) => {
    if (path.endsWith('.ts')) {
      const { transpile } = require('typescript')

      return transpile(source.replace(/^const/gm, 'export const').replace(/^function/gm, 'export function'), tsOptions, path)
    }

    const { transform } = require('@babel/core')

    return transform(source, { ...esOptions, sourceFileName: path }).code
  }
}
