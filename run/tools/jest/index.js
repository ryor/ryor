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
  }
}

export const run = ({ _, coverage, quiet, verbose }) => {
  if (quiet) {
    return new Promise((resolve, reject) =>
      require('cross-spawn')('jest', ['-c', 'run/tools/jest/config.json'].concat(coverage ? ['--coverage'] : []))
        .on('close', code => (code === 0 ? resolve() : reject(new Error('One or more Jest tests failed.')))))
  }

  return [
    'log -w Unit testing source code with Jest\n',
    `jest -c run/tools/jest/config.json --no-cache ${coverage ? ' --coverage' : ''}${verbose ? ' --verbose' : ''} ${_.join(' ')}`,
    'echo',
    'log -s All tests passed'
  ]
}
