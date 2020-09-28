export const description = 'Checks source and runnables code for errors with Standard and Jest'

export const usage = () => require('../utils/usage').composeUsageInformation([
  ['-c  --coverage', 'Generates Jest coverage results'],
  ['-f  --fix', 'Fix errors that can be handled automatically by Standard'],
  ['-p  --concurrent', 'Runs tools concurrently'],
  ['-s  --silent', 'No output unless errors are encountered by tools']
])

export const run = args => {
  const { coverage, fix, concurrent, silent } = require('minimist')(args, {
    alias: { c: 'coverage', f: 'fix', p: 'concurrent', s: 'silent' },
    boolean: ['c', 'coverage', 'f', 'fix', 'p', 'concurrent', 's', 'silent']
  })
  const sequence = [
    `standard${fix ? ' -f' : ''}${silent ? ' -q' : ''}`,
    `jest${coverage ? ' -c' : ''}${silent ? ' -s' : ''}`
  ]

  if (concurrent) sequence.unshift('-c')

  return sequence
}
