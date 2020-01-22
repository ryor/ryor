export default {
  input: 'build/esm/index.js',
  output: {
    esModule: false,
    file: 'build/index.js',
    format: 'cjs'
  },
  external: ['chalk', 'cross-spawn', 'fs', 'minimist', 'os', 'path', 'shell-quote'],
  plugins: [
    {
      resolveId: (importee, importer) => {
        if (importee.endsWith('usage')) return `${importer.split('esm')[0]}esm/lib/usage/index.js`
      }
    },
    {
      renderChunk: source =>
        source
          .replace('exports.run = run;', '')
          .replace(
            'exports.CommandRunnable',
            'exports = configuration => run(process.argv.slice(2), configuration);\nexports.CommandRunnable'
          )
          .replace(/exports/g, 'module.exports')
    }
  ]
}
