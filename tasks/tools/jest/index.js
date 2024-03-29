export const description = 'Unit tests source TypeScript with Jest'

export const args = {
  coverage: {
    alias: 'c',
    description: 'Generates coverage results'
  },
  quiet: {
    alias: 'q',
    description: 'No output unless tests fail'
  },
  verbose: {
    alias: 'v',
    description: 'Verbose test results'
  },
  watch: {
    alias: 'w',
    description: 'Watches for file changes and runs related tests',
    type: 'boolean'
  }
}

export const run = ({ _, coverage, quiet, verbose, watch }) => {
  if (watch) return `onchange "tests/**/*.js" -e "tests/.test-projects/**" -- jest -c tasks/tools/jest/config.json {{changed}}`

  if (quiet) {
    return async () => {
      const { spawn } = await import('cross-spawn')

      await new Promise((resolve, reject) =>
        spawn('jest', ['-c', 'tasks/tools/jest/config.json'].concat(coverage ? ['--coverage'] : [])).on('close', (code) =>
          code === 0 ? resolve() : reject(new Error('One or more Jest tests failed.'))
        )
      )
    }
  }

  return [
    'log -w Unit testing source code with Jest\n',
    `jest -c tasks/tools/jest/config.json --no-cache ${coverage ? ' --coverage' : ''}${verbose ? ' --verbose' : ''} ${_.join(' ')}`,
    'echo',
    'log -s All tests passed'
  ]
}
