'use strict'

const description = 'Verifies that tests pass and build completes succesfully and then commits changes to Git repository'

function usage()
{
  return require('../utils/usage').composeUsageInformation(
    ['-p  --push', 'Pushes commit to Github'],
    ['-r  --release', 'Increments semver patch number in package.json file, creates tag with new version number and pushes commit and tag to Github']
  )
}

function run(args)
{
  const minimist = require('minimist')
  const {_, push, release} = minimist(args, {
    alias: {p: 'push', r: 'release'},
    boolean: ['p', 'push', 'r', 'release']
  })

  if (!release && _.length === 0)
    throw new Error('A commmit message is required')

  const sequence = [
    'log -w Verifying that tests pass and build completes successfully',
    ['test -ps', 'build -s'],
    'shx rm -rf build coverage',
  ]
  let message = _.join(' ')

  if (release)
  {
    sequence.push('patch')

    if (!message)
    {
      const {resolve} = require('path')
      const packageJSONPath = resolve(__dirname, '../../package.json')
      const packageJSON = require(packageJSONPath)
      const semverParts = packageJSON.version.split('.')

      message = `Version ${semverParts[0]}.${semverParts[1]}.${Number(semverParts[2]) + 1}`
    }
  }

  sequence.push(`git commit ${message}`)

  if (release)
    sequence.push('git tag')

  if (push || release)
    sequence.push('git push')

  return sequence
}

module.exports = {description, usage, run}
