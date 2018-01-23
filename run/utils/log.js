'use strict'

const { bold, cyan } = require('chalk')

const description = 'Logs messages with a bit of formatting'

function usage() {
  return require('./usage').composeUsageInformation([
    ['-w  --wait', 'Adds hourglass character to message'],
    ['-s  --success', 'Adds checkmark character to message']
  ])
}

function wait(message) {
  console.log(`${cyan('⏳')} ${bold(message)}`)
}

function success(message) {
  console.log(`${cyan('✓')} ${bold(message)}`)
}

function run(args) {
  const minimist = require('minimist')
  const parsedArgs = minimist(args, {
    alias: { s: 'success', w: 'wait' },
    boolean: ['s', 'success', 'w', 'wait']
  })
  const message = parsedArgs._.join(' ')

  if (parsedArgs.success) return success(message)

  if (parsedArgs.wait) return wait(message)

  console.log(`${cyan('•')} ${bold(message)}`)
}

module.exports = { description, usage, run, wait, success }
