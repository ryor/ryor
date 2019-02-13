'use strict'

const description = 'Transpiles TypeScript and bundles ES modules into single minified CommonJS module with Rollup and UglifyJS'

function usage () {
  return require('../utils/usage').composeUsageInformation([['-s  --silent', 'No output unless errors are encountered by tools']])
}

function run (args) {
  const minimist = require('minimist')
  const { silent } = minimist(args, {
    alias: { s: 'silent' },
    boolean: ['s', 'silent']
  })
  const tools = ['shx rm -rf build/esm', `tsc${silent ? ' -s' : ''}`, `rollup${silent ? ' -s' : ''}`, 'shx rm -rf build/esm']

  if (!silent) tools.push('log -s Build complete')

  return tools
}

module.exports = { description, run, usage }
