export const description = 'Checks source TypeScript and runnables and tests JavaScript for errors with Standard'

export const usage = () => require('../utils/usage').composeUsageInformation([[
  '-c  --concurrent', 'Run tests concurrently',
  '-f  --fix', 'Fix errors that can be handled automatically by Standard',
  '-q  --quiet', 'No output unless errors are encountered',
  '-r  --runnables', 'Check runnables JavaScript for errors',
  '-s  --source', 'Check source TypeScipt for errors',
  '-t  --tests', 'Check tests JavaScript for errors'
]])

export const run = args => {
  const { concurrent, fix, quiet, runnables, source, tests } = require('minimist')(args, {
    alias: { c: 'concurrent', f: 'fix', q: 'quiet', r: 'runnables', s: 'source', t: 'tests' },
    boolean: ['c', 'concurrent', 'f', 'fix', 'q', 'quiet', 'r', 'runnables', 's', 'source', 't', 'tests']
  })
  const all = !runnables && !source && !tests
  let sequence = []

  if (all || source) {
    if (!concurrent && !quiet) sequence.push(`log -w Checking for${fix ? ' and fixing ' : ' '}errors in source TypeScript with Standard`)

    sequence.push(`standardx --parser @typescript-eslint/parser --plugin @typescript-eslint/eslint-plugin source/*.ts${fix ? ' --fix' : ''}`)
  }

  if (all || runnables) {
    if (!concurrent && !quiet) sequence.push(`log -w Checking for${fix ? ' and fixing ' : ' '}errors in runnables JavaScript with Standard`)

    sequence.push(`standardx run/**/*.js${fix ? ' --fix' : ''}`)
  }

  if (all || tests) {
    if (!concurrent && !quiet) sequence.push(`log -w Checking for${fix ? ' and fixing ' : ' '}errors in tests JavaScript with Standard`)

    sequence.push(`standardx tests/*.js${fix ? ' --fix' : ''}`)
  }

  if (concurrent) {
    sequence.unshift('-c')

    if (!quiet) {
      sequence = [
      `log -w Checking for${fix ? ' and fixing ' : ' '}errors with Standard`,
      sequence
      ]
    }
  }

  return sequence
}
