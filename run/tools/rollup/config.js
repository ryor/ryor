export default {
  input: 'build/esm/index.js',
  output: {
    esModule: false,
    file: 'build/index.js',
    format: 'cjs'
  },
  external: ['chalk', 'cross-spawn', 'fs', 'minimist', 'os', 'path', 'shell-quote'],
  plugins: [{
    resolveId: (importee, importer) => importee.endsWith('usage') ? `${importer.split('esm')[0]}esm/lib/usage/index.js` : null
  }]
}
