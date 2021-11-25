const { transform } = require('@babel/core')
const { transpile } = require('typescript')

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
    let code = path.endsWith('.ts')
      ? transpile(source.replace(/^const/gm, 'export const').replace(/^function/gm, 'export function'), tsOptions, path)
      : transform(source, { ...esOptions, sourceFileName: path }).code

    // TEMP
    if (path.includes('chalk/source/index')) code = code.replace('exports.default = _default', 'module.exports = _default')

    return code
  }
}
