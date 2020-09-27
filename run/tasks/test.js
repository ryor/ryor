export const description = 'Checks source and runnables code for errors with Standard and Jest'

export const usage = () => require('../utils/usage').composeUsageInformation([
  ['-c  --coverage', 'Generates Jest coverage results'],
  ['-p  --parallel', 'Runs tools in parallel'],
  ['-f  --fix', 'Fix errors that can be handled automatically by Standard'],
  ['-s  --silent', 'No output unless errors are encountered by tools']
])

export const run = args => {
  const minimist = require('minimist')
  const { coverage, fix, parallel, silent } = minimist(args, {
    alias: { c: 'coverage', f: 'fix', p: 'parallel', s: 'silent' },
    boolean: ['c', 'coverage', 'f', 'fix', 'p', 'parallel', 's', 'silent']
  })
  const sequence = [`standard${fix ? ' -f' : ''}${silent ? ' -q' : ''}`, `jest${coverage ? ' -c' : ''}${silent ? ' -s' : ''}`]

  if (parallel) sequence.unshift('-c')

  return sequence
}
