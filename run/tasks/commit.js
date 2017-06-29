'use strict'

const description = 'Verifies that tests pass and build completes succesfully and then commits changes to Git repository'

function usage()
{
  const {bold} = require('chalk')
  const {EOL} = require('os')
  const options = new Map([
    ['-p  --push   ', 'Pushes commit to Github'],
    ['-r  --release', 'Increments semver patch number in package.json file, creates tag with new version number and pushes commit and tag to Github']
  ])
  const args = '[options]'
  const body = `${bold('Options:')}${EOL}${EOL}${Array.from(options.keys()).map(key => `  ${bold(key)}    ${options.get(key)}`).join(EOL)}`

  return {args, body}
}

function run(args)
{
  const minimist = require('minimist')
  const {_, push, release} = minimist(args, {
    alias: {p: 'push', r: 'release'},
    boolean: ['p', 'push', 'r', 'release']
  })

  if (_.length === 0)
  {
    const {bold} = require('chalk')

    throw new Error(`A commmit message is required to run the ${bold('commit')} task`)
  }

  const sequence = [
    'test',
    'build',
    'shx rm -rf build coverage'
  ]

  if (release)
    sequence.push('patch')

  sequence.push(`git commit ${_.join(' ')}`)

  if (release)
    sequence.push('git tag')

  if (push || release)
    sequence.push('git push')

  return sequence
}

module.exports = {description, usage, run}
