export const description = 'Lints and ensures consistent formatting in source TypeScript and runnables/tests JavaScript with Standard'

export const args = {
  concurrent: {
    alias: 'c',
    description: 'Run checks concurrently'
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
  const checks = []
  let sequence = []

  if (all || source) {
    checks.push('source')
    sequence.push(`standardx --parser @typescript-eslint/parser --plugin @typescript-eslint/eslint-plugin source/*.ts${fix ? ' --fix' : ''}`)
  }

  if (all || runnables) {
    checks.push('runnables')
    sequence.push(`standardx run/**/*.js${fix ? ' --fix' : ''}`)
  }

  if (all || tests) {
    checks.push('tests')
    sequence.push(`standardx tests/*.js${fix ? ' --fix' : ''}`)
  }

  if (concurrent) sequence = [['-c', ...sequence]]

  if (!quiet) sequence.unshift(`log -w Linting and ${fix ? 'fixing' : 'checking for consistent'} formatting in ${checks.reduce((result, check, index, array) => `${result}${array.length === 1 || index === 0 ? '' : index === array.length - 1 ? ' and ' : ', '}${check}`, '')}${concurrent ? ' concurrently' : ''} with Standard...`)

  return sequence
}
