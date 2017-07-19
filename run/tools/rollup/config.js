import {EOL} from 'os'

export default {
  dest: 'build/index.js',
  entry: 'build/esm/index.js',
  external: ['chalk', 'cross-spawn', 'fs', 'minimist',  'os', 'path', 'shell-quote'],
  format: 'cjs',
  plugins: [{
    resolveId: (importee, importer) =>
    {
      if (importee.endsWith('usage'))
        return `${importer.split('esm')[0]}esm/lib/usage/index.js`
    }
  }, {
    transformBundle: source => source
      .replace(`Object.defineProperty(exports, '__esModule', { value: true });${EOL}${EOL}`, '')
      .replace('exports.run = run', 'exports = configuration => run(process.argv.slice(2), configuration)')
      .replace(/exports/g, 'module.exports')
  }]
}
