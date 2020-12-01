export const description = 'Commits all current changes to Git repository'

export const args = {
  build: {
    alias: 'b',
    description: 'Commit changes only if build completes successfully',
    type: 'boolean'
  },
  push: {
    alias: 'p',
    description: 'Pushes commit after verifying tests pass and build completes succesfully',
    type: 'boolean'
  },
  release: {
    alias: 'r',
    description: 'Updates package.json semver patch number and creates version tag for commit',
    type: 'boolean'
  },
  test: {
    alias: 't',
    description: 'Commit changes only if all tests pass',
    type: 'boolean'
  }
}

export const run = ({ _, build, push, release, test }) => {
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
