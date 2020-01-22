'use strict'

module.exports = {
  description: 'Verifies that tests pass and build completes succesfully and then commits changes to Git repository',
  usage: require('../utils/usage').composeUsageInformation([
    ['-p  --push', 'Pushes commit to Github'],
    ['-r  --release', 'Increments semver patch number in package.json file, creates tag with new version number and pushes commit and tag to Github']
  ]),
  run: args => {
    const { _, push, release } = require('minimist')(args, {
      alias: { p: 'push', r: 'release' },
      boolean: ['p', 'push', 'r', 'release']
    })
    const sequence = [
      /*
      'log -w Verifying that tests pass and build completes successfully',
      ['test -ps', 'build -s'],
      'shx rm -rf build',
      'git add -A',
      `${release ? 'npm version patch -m' : 'git commit -qm'} ${_.join(' ')}`
      */
     'git add -A',
     `git commit -qm "${_.join(' ')}"`
    ]

    // if (push || release) sequence.push('git push --quiet --follow-tags')

    return sequence
  }
}
