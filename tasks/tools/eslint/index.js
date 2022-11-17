export const description = 'Lints code with ESLint'

export const args = {
  fix: {
    alias: 'f',
    description: 'Fix issues that can be handled automatically by Eslint',
    type: 'boolean'
  },
  quiet: {
    alias: 'q',
    description: 'No output unless errors are encountered',
    type: 'boolean'
  },
  runnables: {
    alias: 'r',
    description: 'Lints runnables JavaScript',
    type: 'boolean'
  },
  source: {
    alias: 's',
    description: 'Lints source TypeScipt',
    type: 'boolean'
  },
  tests: {
    alias: 't',
    description: 'Lints tests JavaScript',
    type: 'boolean'
  },
  watch: {
    alias: 'w',
    description: 'Watches for file changes and lints changed files',
    type: 'boolean'
  }
}

export const run = ({ fix, quiet, runnables, source, tests, watch }) => {
  if (!runnables && !source && !tests) runnables = source = tests = true

  const command = `eslint -c tasks/tools/eslint/.eslintrc ${fix && !watch ? ' --fix ' : ''}`
  const targets = [runnables && 'runnables', source && 'source', tests && 'tests'].filter((target) => !!target)
  const paths = targets.map((target) => `"${target === 'runnables' ? 'tasks/**/*.js' : target === 'source' ? 'source/**/*.ts' : 'tests/**/*.js'}"`).join(' ')

  if (watch) return `onchange ${paths} -- ${command} {{changed}}`

  if (quiet) return `${command} ${paths}`

  return [
    `log -w ${`Linting${fix ? ' and fixing ' : ' '}${targets.reduce(
      (result, target, index, array) => `${result}${array.length === 1 || index === 0 ? '' : index === array.length - 1 ? ' and ' : ', '}${target}`,
      ''
    )} code with ESlint`}`,
    `${command} ${paths}`
  ]
}
