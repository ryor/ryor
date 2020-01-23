'use strict'

module.exports = {
  description: 'Transpiles TypeScript and bundles ES modules into single minified CommonJS module with Rollup and UglifyJS',
  usage: require('../utils/usage').composeUsageInformation([[
    '-s  --silent', 'No output unless errors are encountered by tools'
  ]]),
  run: args => {
    const { silent } = require('minimist')(args, {
      alias: { s: 'silent' },
      boolean: ['s', 'silent']
    })
    const sequence = [
      'shx rm -rf build',
      `tsc${silent ? ' -s' : ''}`,
      `rollup${silent ? ' -s' : ''}`,
      () => {
        const { readFileSync, writeFileSync } = require('fs')

        writeFileSync(
          'build/index.js',
          readFileSync('build/index.js')
            .toString()
            .replace('exports.run = run;', '')
            .replace(
              'exports.CommandRunnable',
              'exports = configuration => run(process.argv.slice(2), configuration);\nexports.CommandRunnable'
            )
            .replace(/exports/g, 'module.exports')
        )
      },
      'shx rm -rf build/esm',
      'shx cp package.json README.md build'
    ]

    if (!silent) sequence.push('log -s Build complete')

    return sequence
  }
}
