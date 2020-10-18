export const description = 'Transpiles TypeScript and bundles ES modules into single minified CommonJS module with Rollup and Terser'

export const usage = () => require('../utils/usage').composeUsageInformation([[
  '-d  --development', 'Development build (skips minification)',
  '-q  --quiet', 'No output unless errors are encountered by tools'
]])

export const run = args => {
  const { readFileSync, writeFileSync } = require('fs')
  const { development, quiet } = require('minimist')(args, {
    alias: { d: 'development', q: 'quiet' },
    boolean: ['d', 'development', 'q', 'quiet']
  })
  const sequence = [
    'shx rm -rf build',
    `tsc${quiet ? ' -q' : ''}`,
    `rollup${quiet ? ' -q' : ''}`,
    ['-c',
      () => {
        const packageJSON = JSON.parse(readFileSync('package.json').toString())

        delete packageJSON.devDependencies

        writeFileSync('build/package.json', JSON.stringify(packageJSON, null, '  '))
      },
      () => {
        writeFileSync(
          'build/index.js',
          readFileSync('build/index.js')
            .toString()
            .replace('exports.composeUsageInformationList = composeUsageInformationList;', '')
            .replace(
              'exports.runCommandLineInput = runCommandLineInput;',
              'module.exports = configuration => runCommandLineInput(process.argv.slice(2), configuration);\n' +
              'module.exports.composeUsageInformationList = composeUsageInformationList;'
            )
        )
      },
      'shx cp README.md build',
      'shx rm -rf build/esm build/node_modules'
    ]
  ]

  if (!development) sequence.push(`terser${quiet ? ' -s' : ''}`)

  if (!quiet) sequence.push('log -s Build complete')

  return sequence
}
