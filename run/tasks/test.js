'use strict'

const description = 'Checks TypeScript for errors with TSLint and tests TypeScript with Jest'

function usage()
{
  return require('../utils/usage').composeUsageInformation([
    ['-c  --coverage', 'Generates Jest coverage results'],
    ['-p  --parallel', 'Runs tools in parallel'],
    ['-s  --silent', 'No output unless errors are encountered by tools']
  ])
}

function run(args)
{
  const minimist = require('minimist')
  const {coverage, parallel, silent} = minimist(args, {
    alias: {c: 'coverage', p: 'parallel', s: 'silent'},
    boolean: ['c', 'coverage', 'p', 'parallel', 's', 'silent']
  })
  let tools = [
    `tslint${silent ? ' -s' : ''}`,
    `jest${coverage ? ' -c' : ''}${silent ? ' -s' : ''}`
  ]

  if (parallel)
    tools = [tools]

  return tools
}

module.exports = {description, run, usage}
