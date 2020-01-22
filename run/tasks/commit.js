'use strict'

module.exports = {
  description: 'Commits all current changes to Git repository',
  usage: require('../utils/usage').composeUsageInformation([
    ['-t  --test', 'Commit changes only if all tests pass'],
    ['-b  --build', 'Commit changes only if build completes successfully'],
    ['-r  --release', 'Updates package.json semver patch number and creates version tag for commit'],
    ['-p  --push', 'Pushes commit after verifying tests pass and build completes succesfully']
  ]),
  run: args => {
    const { _, build, push, release, test } = require('minimist')(args, {
      alias: { b: 'build', p: 'push', r: 'release', t: 'test' },
      boolean: ['b', 'build', 'p', 'push', 'r', 'release', 't', 'test']
    })
    const message = _.join(' ').trim()
    const sequence = []
    const parallelSequence = []
    const doPush = push || release
    const doBuild = build || doPush
    const doTest = test || doPush
    let logMessage = ''

    if (doTest) {
      logMessage += 'Verifying that all tests pass'
      parallelSequence.push('test -fps')
    }

    if (doBuild) {
      logMessage += `${logMessage ? ' and' : 'Verifying that'} build completes successfully`
      parallelSequence.push('build -s')
    }

    if (doBuild || doTest) sequence.push(`log -w ${logMessage}`, parallelSequence)

    if (doBuild) sequence.push('shx rm -rf build')

    sequence.push(
      'git add -A',
      `git commit -q ${message ? ` -m "${message}"` : ''}`
    )

    if (doPush) sequence.push('git push --quiet --follow-tags')

    return sequence
  }
}
