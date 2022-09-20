import { transformSync } from 'esbuild'
/*
const { transform } = require('@babel/core')
const { transformSync } = require('esbuild')
const { posix, sep } = require('path')
const { transpile } = require('typescript')

const esOptions = {
  babelrc: false,
  plugins: ['@babel/plugin-transform-modules-commonjs']
}

const tsOptions = {
  ...require('../esbuild/tsconfig.json').compilerOptions,
  inlineSourceMap: true,
  module: 'CommonJS'
}
*/

export default {
  process (source, path) {
    // if (path.includes('node_modules')) return { code: source }

    const { code } = transformSync(source, { format: 'cjs', loader: path.endsWith('.ts') ? 'ts' : 'js' })

    /*
      let code = path.endsWith('.ts')
        ? transpile(source.replace(/^const/gm, 'export const').replace(/^function/gm, 'export function'), tsOptions, path)
        : transform(source, {
          ...esOptions,
          sourceFileName: path,
          sourceMaps: path.includes('node_modules') ? false : 'inline'
        }
        ).code
        */

    // TEMP
    /*
      if (path.includes('chalk')) {
        const posixPath = path.split(sep).join(posix.sep)

        if (posixPath.includes('chalk/source/index.js')) code = code.replace('exports.default = _default', 'module.exports = _default')

        else if (posixPath.includes('chalk/source/vendor/supports-color/index.js')) code = code.split('node:').join('')
      }
      */

    return { code }
  }
}
