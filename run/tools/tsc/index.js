'use strict'

const description = 'Transpiles TypeScript into JavaScript ES modules'

function usage()
{
  return require('../../utils/usage').composeUsageInformation(
    ['-s  --silent', 'No output unless errors are encountered by TypeScript compiler']
  )
}

function run(args)
{
  const minimist = require('minimist')
  const {silent} = minimist(args, {
    alias: {s: 'silent'},
    boolean: ['s:', 'silent']
  })
  const sequence = ['tsc -p run/tools/tsc/config.json']

  if (!silent)
    sequence.unshift('log -w Transpiling TypeScript')

  return sequence
}

module.exports = {description, run, usage}
