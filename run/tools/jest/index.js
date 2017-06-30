'use strict'

const description = 'Tests TypeScript with Jest'

function usage()
{
  const {bold} = require('chalk')
  const {EOL} = require('os')
  const options = new Map([
    ['-c  --coverage', 'Generates coverage results'],
    ['-v  --verbose ', 'Verbose test results']
  ])
  const args = '[options]'
  const body = `${bold('Options:')}${EOL}${EOL}${Array.from(options.keys()).map(key => `  ${bold(key)}    ${options.get(key)}`).join(EOL)}`

  return {args, body}
}

function run(args)
{
  const minimist = require('minimist')
  const {coverage, verbose} = minimist(args, {
    alias: {c: 'coverage', v: 'verbose'},
    boolean: ['c', 'coverage', 'v', 'verbose']
  })

  return [
    'log -w Testing TypeScript with Jest',
    'echo',
    `jest -c run/tools/jest/config.json${coverage ? ' --coverage' : ''}${verbose ? ' --verbose' : ''}`,
    'echo',
    'log -s All tests passed'
  ]
}

module.exports = {description, usage, run}
