export const description = 'Transpiles TypeScript and bundles ES modules into single minified CommonJS module with Rollup and Terser'

export const usage = () => require('../utils/usage').composeUsageInformation([[
  '-d  --development', 'Development build (skips minification)',
  '-s  --silent', 'No output unless errors are encountered by tools'
]])

export const run = args => {
  const { readFileSync, writeFileSync } = require('fs')
  const { development, silent } = require('minimist')(args, {
    alias: { d: 'development', s: 'silent' },
    boolean: ['d', 'development', 's', 'silent']
  })
  const sequence = [
    'shx rm -rf build',
    `tsc${silent ? ' -s' : ''}`,
    `rollup${silent ? ' -s' : ''}`,
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

  if (!development) sequence.push(`terser${silent ? ' -s' : ''}`)

  if (!silent) sequence.push('log -s Build complete')

  return sequence
}
