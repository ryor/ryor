export const description = 'Checks source and runnables code for errors with Standard and Jest'

export const args = {
  concurrent: {
    alias: 'p',
    description: 'Runs tools concurrently'
  },
  coverage: {
    alias: 'c',
    description: 'Generates Jest coverage results'
  },
  fix: {
    alias: 'f',
    description: 'Fix errors that can be handled automatically by Standard'
  },
  quiet: {
    alias: 'q',
    description: 'No output unless errors are encountered by tools'
  }
}

export const run = ({ coverage, fix, concurrent, quiet }) => {
  const sequence = [
    `standard${fix ? ' -f' : ''}${quiet ? ' -q' : ''}`,
    `jest${coverage ? ' -c' : ''}${quiet ? ' -q' : ''}`
  ]

  if (concurrent) sequence.unshift('-c')

  return sequence
}
