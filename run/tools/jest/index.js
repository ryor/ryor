export const description = 'Tests TypeScript with Jest'

export const usage = () => require('../../utils/usage').composeUsageInformation([
  ['-c  --coverage', 'Generates coverage results'],
  ['-s  --silent', 'No output unless tests fail'],
  ['-v  --verbose', 'Verbose test results']
])

export const run = args => {
  const { _, coverage, silent, verbose } = require('minimist')(args, {
    alias: { c: 'coverage', s: 'silent', v: 'verbose' },
    boolean: ['c', 'coverage', 's:', 'silent', 'v', 'verbose']
  })

  if (silent) {
    return new Promise((resolve, reject) => {
      const { spawn } = require('cross-spawn')
      const childProcess = spawn('jest',
        ['-c', 'run/tools/jest/config.json']
          .concat(coverage ? ['--coverage'] : [])
          .concat(verbose ? ['--verbose'] : [])
      )
      let stderr = ''

      childProcess.stderr.on('data', data => (stderr += data))

      childProcess.on('close', code => {
        if (code !== 0) reject(new Error('One or more Jest tests failed.'))

        resolve()
      })
    })
  }

  return [
    'log -w Testing TypeScript with Jest',
    'echo',
    `jest -c run/tools/jest/config.json --no-cache ${coverage ? ' --coverage' : ''}${verbose ? ' --verbose' : ''} ${_.join(' ')}`,
    'echo',
    'log -s All tests passed'
  ]
}
