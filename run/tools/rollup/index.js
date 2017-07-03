'use strict'

const description = 'Bundles ES modules produced by TypeScript into single CommonJS module with Rollup'

function usage()
{
  return require('../../utils/usage').composeUsageInformation([
    ['-s  --silent', 'No output unless errors are encountered by Rollup']
  ])
}

function run(args)
{
  const minimist = require('minimist')
  const {silent} = minimist(args, {
    alias: {s: 'silent'},
    boolean: ['s:', 'silent']
  })
  const sequence = ['rollup -c run/tools/rollup/config.js']

  if (!silent)
    sequence.unshift('log -w Bundling module with Rollup')

  return sequence
}

module.exports = {description, run, usage}
