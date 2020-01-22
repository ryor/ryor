'use strict'

module.exports = {
  description: 'Commits all current changes to Git repository',
  usage: require('../utils/usage').composeUsageInformation([
    ['-b  --build',   'Commit changes only if build completes successfully'],
    ['-t  --test',    'Commit changes only if all tests pass'],
    ['-p  --push',    'Push commit'],
    ['-r  --release', 'Increments package patch number and tags and pushes commit']
  ]),
  run: args => {
    const { _, build, push, release, test } = require('minimist')(args, {
      alias: { b: 'build', p: 'push', r: 'release', t: 'test' },
      boolean: ['b', 'build', 'p', 'push', 'r', 'release', 't', 'test']
    })
    const message = _.join(' ')

    if (!message)
      throw new Error(`A message is required for the commit`)

    const sequence = []

    if (test)
      sequence.push(
        'log -w Verifying that all tests pass',
        'test -ps'
      )

    if (build)
      sequence.push(
        'log -w Verifying that build completes successfully',
        'build -s',
        'shx rm -rf build'
      )

    sequence.push(
      'git add -A',
      `${release ? 'npm version patch -m' : 'git commit -qm'} "${message}"`
    )

    if (push || release) sequence.push('git push --quiet --follow-tags')

    return sequence
  }
}
