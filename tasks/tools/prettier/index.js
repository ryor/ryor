export const description = 'Formats code with Prettier'

export const args = {
  quiet: {
    alias: 'q',
    description: 'No output unless errors are encountered',
    type: 'boolean'
  },
  runnables: {
    alias: 'r',
    description: 'Formats runnables JavaScript',
    type: 'boolean'
  },
  source: {
    alias: 's',
    description: 'Formats source TypeScipt',
    type: 'boolean'
  },
  tests: {
    alias: 't',
    description: 'Formats tests JavaScript',
    type: 'boolean'
  },
  watch: {
    alias: 'w',
    description: 'Watches for file changes and formats changed files',
    type: 'boolean'
  }
}

export const run = ({ quiet, runnables, source, tests, watch }) => {
  if (!runnables && !source && !tests) runnables = source = tests = true

  const command = `prettier --config run/tools/prettier/.prettierrc --ignore-path run/tools/prettier/.prettierignore --loglevel=${
    watch || quiet ? 'silent' : 'warn'
  } --write`
  const targets = [runnables && 'runnables', source && 'source', tests && 'tests'].filter((target) => !!target)
  const paths = targets.map((target) => `"${target === 'runnables' ? 'run/**/*.js' : target === 'source' ? 'source/**/*.ts' : 'tests/**/*.js'}"`).join(' ')

  if (watch) return `onchange ${paths} -- ${command} {{changed}}`

  if (quiet) return `${command} ${paths}`

  return [
    `log -w ${`Formatting ${targets.reduce(
      (result, target, index, array) => `${result}${array.length === 1 || index === 0 ? '' : index === array.length - 1 ? ' and ' : ', '}${target}`,
      ''
    )} code with Prettier`}`,
    `${command} ${paths}`
  ]
}
