export const description = 'Checks source TypeScript and runnables JavaScript for errors with Standard'

export const usage = () => require('../utils/usage').composeUsageInformation([[
  '-s  --source', 'Check source TypeScipt for errors',
  '-r  --runnables', 'Check runnables JavaScript for errors',
  '-f  --fix', 'Fix errors that can be handled automatically by Standard',
  '-q  --quiet', 'No output unless errors are encountered'
]])

export const run = args => {
  const { fix, quiet, runnables, source } = require('minimist')(args, {
    alias: { f: 'fix', q: 'quiet', r: 'runnables', s: 'source' },
    boolean: ['f', 'fix', 'q', 'quiet', 'r', 'runnables', 's', 'source']
  })
  const both = !runnables && !source
  const sequence = []

  if (both || source) {
    if (!quiet) sequence.push(`log -w Checking for${fix ? ' and fixing ' : ' '}errors in source TypeScript with Standard`)

    sequence.push(`standardx --env node --parser @typescript-eslint/parser --plugin @typescript-eslint/eslint-plugin source/*.ts${fix ? ' --fix' : ''}`)
  }

  if (both || runnables) {
    if (!quiet) sequence.push(`log -w Checking for${fix ? ' and fixing ' : ' '}errors in runnables JavaScript with Standard`)

    sequence.push(`standardx --env node run/**/*.js${fix ? ' --fix' : ''}`)
  }

  return sequence
}
