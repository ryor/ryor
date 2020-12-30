export const description = 'Lints and ensures consistent formatting in source TypeScript and runnables/tests JavaScript with Standard'

export const args = {
  fix: {
    alias: 'f',
    description: 'Fix issues that can be handled automatically by Standard'
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

export const run = ({ fix, quiet, runnables, source, tests }) => {
  const all = !runnables && !source && !tests
  const checks = []
  let sequence = ['-c']

  if (all || source) {
    checks.push('source')
    sequence.push(`ts-standard${fix ? ' --fix' : ''} --project run/tools/tsc/config.json source/*.ts`)
  }

  if (all || runnables) {
    checks.push('runnables')
    sequence.push(`standard${fix ? ' --fix' : ''} run/**/*.js`)
  }

  if (all || tests) {
    checks.push('tests')
    sequence.push(`standard${fix ? ' --fix' : ''} tests/*.js`)
  }

  if (!quiet) {
    sequence = [
    `log -w Linting ${fix ? 'and fixing issues in' : ''} ${checks.reduce((result, check, index, array) => `${result}${array.length === 1 || index === 0 ? '' : index === array.length - 1 ? ' and ' : ', '}${check}`, '')} code with Standard...`,
    sequence
    ]
  }

  return sequence
}
