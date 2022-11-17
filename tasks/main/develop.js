export const description = 'Runs development tools'

export const args = {
  runnables: {
    alias: 'r',
    description: 'Runs Eslint/Prettier on any changed runnable files',
    type: 'boolean'
  },
  source: {
    alias: 's',
    description: 'Runs Eslint/Prettier on any changed source files (included by default)',
    type: 'boolean'
  },
  tests: {
    alias: 't',
    description: 'Runs Eslint/Prettier on any changed test files and runs the test with Jest (included by default)',
    type: 'boolean'
  }
}

export const run = async ({ runnables, source, tests }) => {
  if (!runnables && !source && !tests) source = tests = true

  const targets = [runnables && 'runnables', source && 'source', tests && 'tests'].filter((target) => !!target)
  const sequence = [
    `log -w ${`Watching ${targets.reduce(
      (result, target, index, array) => `${result}${array.length === 1 || index === 0 ? '' : index === array.length - 1 ? ' and ' : ', '}${target}`,
      ''
    )} code for changes...`}`,
    tests
      ? ['-c', `eslint -${runnables ? 'r' : ''}${source ? 's' : ''}tw`, 'jest -w']
      : `eslint -${runnables ? 'r' : ''}${source ? 's' : ''}${tests ? 't' : ''}w`
  ]

  return sequence
}
