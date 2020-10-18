export const description = 'Tests TypeScript with Jest'

export const usage = () => require('../../utils/usage').composeUsageInformation([
  ['-c  --coverage', 'Generates coverage results'],
  ['-q  --quiet', 'No output unless tests fail'],
  ['-v  --verbose', 'Verbose test results']
])

export const run = args => {
  const { _, coverage, quiet, verbose } = require('minimist')(args, {
    alias: { c: 'coverage', q: 'quiet', v: 'verbose' },
    boolean: ['c', 'coverage', 'q', 'quiet', 'v', 'verbose']
  })

  if (quiet) {
    return new Promise((resolve, reject) =>
      require('cross-spawn')('jest', ['-c', 'run/tools/jest/config.json'].concat(coverage ? ['--coverage'] : []))
        .on('close', code => (code === 0 ? resolve() : reject(new Error('One or more Jest tests failed.')))))
  }

  return [
    'log -w Testing TypeScript with Jest\n',
    `jest -c run/tools/jest/config.json --no-cache ${coverage ? ' --coverage' : ''}${verbose ? ' --verbose' : ''} ${_.join(' ')}`,
    'echo',
    'log -s All tests passed'
  ]
}
