'use strict'

const description = 'Checks TypeScript for errors with TSLint'

function usage() {
  return require('../../utils/usage').composeUsageInformation([['-s  --silent', 'No output unless errors are encountered']])
}

function run(args) {
  const log = require('../../utils/log')
  const minimist = require('minimist')
  const { silent } = minimist(args, {
    alias: { s: 'silent' },
    boolean: ['s', 'silent']
  })

  if (!silent) log.wait('Checking TypeScript for errors with TSLint')

  return new Promise((resolve, reject) => {
    const { spawn } = require('cross-spawn')
    const childProcess = spawn('tslint', ['-c', 'run/tools/tslint/config.json', '-p', 'run/tools/tsc/config.json', 'source/**/*.ts'])
    let errors = ''

    childProcess.stderr.on('data', data => (errors += data))
    childProcess.stdout.on('data', data => (errors += data))

    childProcess.on('close', code => {
      errors = errors.trim()

      if (errors) return reject(errors)

      if (!silent) log.success('No errors found')

      resolve()
    })
  })
}

module.exports = { description, run, usage }
