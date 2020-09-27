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
  const concurrentSequence = []
  const doPush = push || release
  const doBuild = build || doPush
  const doTest = test || doPush
  let logMessage = ''

  if (doTest) {
    logMessage += 'Verifying that all tests pass'
    concurrentSequence.push('test -fps')
  }

  if (doBuild) {
    logMessage += `${logMessage ? ' and' : 'Verifying that'} build completes successfully`
    concurrentSequence.push('build -s')
  }

  if (doBuild || doTest) sequence.push(`log -w ${logMessage}`, ['-c', ...concurrentSequence])

  if (doBuild) sequence.push('shx rm -rf build')

  sequence.push(
    'git add -A',
    `git commit -q ${message ? ` -m "${message}"` : ''}`
  )

  if (release) sequence.push('npm version patch')

  if (doPush) sequence.push('git push --quiet --follow-tags')

  return sequence
}
