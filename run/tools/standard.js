export const description = 'Checks source TypeScript and runnables and tests JavaScript for errors and ensures consistent formatting with Standard'

export const args = {
  concurrent: {
    alias: 'c',
    description: 'Run tests concurrently'
  },
  fix: {
    alias: 'f',
    description: 'Fix formatting that can be handled automatically by Standard'
  },
  quiet: {
    alias: 'q',
    description: 'No output unless errors are encountered'
  },
  runnables: {
    alias: 'r',
    description: 'Check runnables JavaScript'
  },
  source: {
    alias: 's',
    description: 'Check source TypeScipt'
  },
  tests: {
    alias: 't',
    description: 'Check tests JavaScript'
  }
}

export const run = ({ concurrent, fix, quiet, runnables, source, tests }) => {
  const all = !runnables && !source && !tests
  let sequence = []

  if (all || source) {
    if (!concurrent && !quiet) sequence.push('log -w Checking for errors and consistent formatting in source TypeScript with Standard...')

    sequence.push(`standardx --parser @typescript-eslint/parser --plugin @typescript-eslint/eslint-plugin source/*.ts${fix ? ' --fix' : ''}`)
  }

  if (all || runnables) {
    if (!concurrent && !quiet) sequence.push('log -w Checking for errors and consistent formatting in runnables JavaScript with Standard...')

    sequence.push(`standardx run/**/*.js${fix ? ' --fix' : ''}`)
  }

  if (all || tests) {
    if (!concurrent && !quiet) sequence.push('log -w Checking for errors and consistent formatting in tests JavaScript with Standard...')

    sequence.push(`standardx tests/*.js${fix ? ' --fix' : ''}`)
  }

  if (concurrent) {
    sequence.unshift('-c')

    if (!quiet) {
      sequence = [
        'log -w Checking for errors and consistent formatting with Standard...',
        sequence
      ]
    }
  }

  return sequence
}
