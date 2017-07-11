import {EOL} from 'os'

export default {
  dest: 'build/index.js',
  entry: 'build/esm/index.js',
  external: ['chalk', 'cross-spawn', 'fs', 'minimist',  'os', 'path', 'shell-quote'],
  format: 'cjs',
  plugins: [{
		resolveId: (importee, importer) => importee === './utils/usage' ? importer.replace('index.js', 'utils/usage/index.js') : undefined
  }, {
    transformBundle: source => source
      .replace(`Object.defineProperty(exports, '__esModule', { value: true });${EOL}${EOL}`, '')
      .replace('exports.run = run', 'exports = () => run(process.argv.slice(2))')
      .replace(/exports/g, 'module.exports')
  }]
}
