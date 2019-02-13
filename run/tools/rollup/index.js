'use strict'

const description = 'Bundles ES modules produced by TypeScript into single CommonJS module with Rollup'

function usage () {
  return require('../../utils/usage').composeUsageInformation([['-s  --silent', 'No output unless errors are encountered by Rollup']])
}

function run (args) {
  const { silent } = require('minimist')(args, {
    alias: { s: 'silent' },
    boolean: ['s:', 'silent'],
    unknown: value => {
      const { bold } = require('chalk')

      throw new Error(`Invalid value ${bold(value)} passed to ${bold('rollup')} tool.`)
    }
  })

  return (silent ? [] : ['log -w Bundling module with Rollup']).concat('rollup -c run/tools/rollup/config.js --silent')
}

module.exports = { description, run, usage }
