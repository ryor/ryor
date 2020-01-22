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
      'shx rm -rf build/esm',
      `tsc${silent ? ' -s' : ''}`,
      `rollup${silent ? ' -s' : ''}`,
      'shx rm -rf build/esm',
      'shx cp package.json README.md build'
    ]

    if (!silent) sequence.push('log -s Build complete')

    return sequence
  }
}
