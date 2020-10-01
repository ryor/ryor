export const description = 'Commits all current changes to Git repository'

export const usage = () => require('../utils/usage').composeUsageInformation([
  ['-t  --test', 'Commit changes only if all tests pass'],
  ['-b  --build', 'Commit changes only if build completes successfully'],
  ['-r  --release', 'Updates package.json semver patch number and creates version tag for commit'],
  ['-p  --push', 'Pushes commit after verifying tests pass and build completes succesfully']
])

export const run = args => {
  const { _, build, push, release, test } = require('minimist')(args, {
    alias: { b: 'build', p: 'push', r: 'release', t: 'test' },
    boolean: ['b', 'build', 'p', 'push', 'r', 'release', 't', 'test']
  })
  const message = _.join(' ').trim()
  const sequence = []
  const doPush = push || release
  const doBuild = build || doPush
  const doTest = test || doPush
  const preCommit = ['-c']
  let preCommitMessage = ''

  if (doTest) {
    preCommit.push('test -fps')
    preCommitMessage = 'Verifying that all tests pass'
  }

  if (doBuild) {
    preCommit.push('build -s')
    preCommitMessage += `${preCommitMessage ? ' and' : 'Verifying that'} build completes successfully`
  }

  if (doBuild || doTest) sequence.push(`log -w ${preCommitMessage}`, preCommit)

  if (doBuild) sequence.push('shx rm -rf build')

  sequence.push(
    'git add -A',
    release
      ? `npm version patch -f ${message ? ` -m "${message}"` : ''}`
      : `git commit -q${message ? `m "${message}"` : ''}`
  )

  if (doPush) sequence.push('git push --quiet --follow-tags')

  return sequence
}
