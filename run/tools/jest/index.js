'use strict'

const description = 'Tests TypeScript with Jest'

function usage()
{
  return require('../../utils/usage').composeUsageInformation([
    ['-c  --coverage', 'Generates coverage results'],
    ['-s  --silent', 'No output unless tests fail'],
    ['-v  --verbose', 'Verbose test results']
  ])
}

function run(args)
{
  const minimist = require('minimist')
  const {coverage, silent, verbose} = minimist(args, {
    alias: {c: 'coverage', s: 'silent', v: 'verbose'},
    boolean: ['c', 'coverage', 's:', 'silent', 'v', 'verbose']
  })

  if (silent)
    return new Promise((resolve, reject) =>
    {
      const {spawn} = require('cross-spawn')
      const childProcess = spawn('jest', ['-c', 'run/tools/jest/config.json'].concat(coverage ? ['--coverage'] : []))
      let stderr = ''

      childProcess.stderr.on('data', data => stderr += data)

      childProcess.on('close', code =>
      {
        if (code !== 0)
          reject('One or more Jest tests failed.')

        resolve()
      })
    })

  return [
    'log -w Testing TypeScript with Jest',
    'echo',
    `jest -c run/tools/jest/config.json${coverage ? ' --coverage' : ''}${silent ? ' --silent' : ''}${verbose ? ' --verbose' : ''}`,
    'echo',
    'log -s All tests passed'
  ]
}

module.exports = {description, usage, run}
