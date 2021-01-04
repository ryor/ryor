import { bold } from 'chalk'
import { getCurrentBranchName, isCommitRequired } from '../utils/git'

export const description = 'Commits all current changes to Git repository'

export const args = {
  build: {
    alias: 'b',
    description: 'Commit changes only if build completes successfully',
    type: 'boolean'
  },
  merge: {
    alias: 'm',
    description: 'Merges feature branch into develop branch or release branch into main (will automatically include testing and building before commit)',
    type: 'boolean'
  },
  push: {
    alias: 'p',
    description: 'Push changes to origin server',
    type: 'boolean'
  },
  test: {
    alias: 't',
    description: 'Commit changes only if all tests pass',
    type: 'boolean'
  }
}

export const run = async ({ _, build, merge, push, test }) => {
  const message = _.join(' ').trim()
  const sequence = []
  const doBuild = build || merge
  const doTest = test || merge
  const preCommitSequence = ['-c']
  let preCommitMessage = ''

  if (doTest) {
    preCommitSequence.push('test -fq')
    preCommitMessage = 'Verifying that all tests pass'
  }

  if (doBuild) {
    preCommitSequence.push('build -q')
    preCommitMessage += `${preCommitMessage ? ' and' : 'Verifying that'} build completes successfully`
  }

  if (doBuild || doTest) sequence.push(`log -w ${preCommitMessage}`, preCommitSequence)

  if (doBuild) sequence.push('shx rm -rf build')

  sequence.push(async () => {
    if (await isCommitRequired()) {
      return [
        'git add -A',
      `git commit${message ? ` -m "${message}"` : ''}`
      ]
    }
  })

  if (merge) {
    const currentBranchName = await getCurrentBranchName()
    const isFeature = currentBranchName.startsWith('feature/')
    const isRelease = currentBranchName.startsWith('release/')

    if (isFeature || isRelease) {
      sequence.push(
        `git checkout ${isFeature ? 'develop' : 'main'}`,
        'git pull',
        `git merge -X theirs --squash ${currentBranchName}`,
        'git commit',
        'git push',
        `git branch -D ${currentBranchName}`,
        `git push origin --delete ${currentBranchName}`,
        `log -s ${
          isFeature ? 'Feature' : 'Release'
        } ${
          currentBranchName.split(`${isFeature ? 'feature' : 'release'}/`)[1]
        } merged into ${
          isFeature ? 'develop' : 'main'
        } branch`
      )

      if (isRelease) {
        sequence.push(() => {
          const { version } = require('../../package.json')

          return [
          `git tag -a v${version} -m "Version ${version}"`,
          `git push origin v${version}`
          ]
        })
      }
    } else {
      console.error(`Merge only possible on feature or release branch; current branch is ${bold(currentBranchName)}.`)
      process.exit(1)
    }
  } else if (push) sequence.push('git push')

  return sequence
}
