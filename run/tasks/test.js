'use strict'

const description = 'Checks source and runnables code for errors with ESLint and Jest'

function usage () {
  return require('../utils/usage').composeUsageInformation([
    ['-c  --coverage', 'Generates Jest coverage results'],
    ['-p  --parallel', 'Runs tools in parallel'],
    ['-f  --fix', 'Fix errors that can be handled automatically by ESlist'],
    ['-s  --silent', 'No output unless errors are encountered by tools']
  ])
}

function run (args) {
  const minimist = require('minimist')
  const { coverage, fix, parallel, silent } = minimist(args, {
    alias: { c: 'coverage', f: 'fix', p: 'parallel', s: 'silent' },
    boolean: ['c', 'coverage', 'f', 'fix', 'p', 'parallel', 's', 'silent']
  })
  let tools = [`eslint${fix ? ' -f' : ''}${silent ? ' -q' : ''}`, `jest${coverage ? ' -c' : ''}${silent ? ' -s' : ''}`]

  if (parallel) tools = [tools]

  return tools
}

module.exports = { description, run, usage }
