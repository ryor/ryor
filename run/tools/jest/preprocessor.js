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
    if (path.endsWith('.js') && path.includes('test-projects')) return transpileES(source, esOptions).code

    if (path.endsWith('.ts')) {
      if (path.endsWith('requireRunnableModule.ts')) {
        source = source
          .replace("import esm from 'esm'", '')
          .replace('const esmRequire:typeof require = esm(module)', '')
          .replace('esmRequire', 'require')
      } else if (path.endsWith('runShellCommand.ts')) {
        source = source
          .replace(", stdio: ['ignore', 1, 2]", '')
          .replace(
            "let error:string = ''",
            "let error:string = ''\n\n" +
            "childProcess.stderr!.on('data', (data:any):void => { process.stderr.write(data) })\n" +
            "childProcess.stdout!.on('data', (data:any):void => { process.stdout.write(data) })"
          )
      }

      source = source.replace(/^const/gm, 'export const').replace(/^function/gm, 'export function')

      return transpileTS(source, tsOptions, path)
    }

    return source
  }
}
