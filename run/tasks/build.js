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
      'shx rm -rf build/esm',
      () => {
        const { copyFileSync, readFileSync, writeFileSync } = require('fs')
        const json = JSON.parse(readFileSync('package.json'))

        delete json.devDependencies

        json.bin = {
          ryor: './cli'
        }

        copyFileSync('README.md', 'build/README.md')
        writeFileSync('build/cli.js', '#!/usr/bin/env node\nrequire("./index").run()')
        writeFileSync('build/package.json', JSON.stringify(json, null, ' '))
      }
    ]

    if (!silent) sequence.push('log -s Build complete')

    return sequence
  }
}
