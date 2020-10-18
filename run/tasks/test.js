export const description = 'Checks source and runnables code for errors with Standard and Jest'

export const usage = () => require('../utils/usage').composeUsageInformation([
  ['-c  --coverage', 'Generates Jest coverage results'],
  ['-f  --fix', 'Fix errors that can be handled automatically by Standard'],
  ['-p  --concurrent', 'Runs tools concurrently'],
  ['-q  --quiet', 'No output unless errors are encountered by tools']
])

export const run = args => {
  const { coverage, fix, concurrent, quiet } = require('minimist')(args, {
    alias: { c: 'coverage', f: 'fix', p: 'concurrent', q: 'quiet' },
    boolean: ['c', 'coverage', 'f', 'fix', 'p', 'concurrent', 'q', 'quiet']
  })
  const sequence = [
    `standard${fix ? ' -f' : ''}${quiet ? ' -q' : ''}`,
    `jest${coverage ? ' -c' : ''}${quiet ? ' -q' : ''}`
  ]

  if (concurrent) sequence.unshift('-c')

  return sequence
}
