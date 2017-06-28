const description = 'Verifies that tests pass and build completes succesfully, commits changes to Git repository. Optionally creates release tag and/or pushes commit/tag to Github'

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

module.exports = {description, run}
