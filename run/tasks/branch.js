import { bold } from 'chalk'
import { getCurrentBranchName, isCodeCommitted, isExistingBranch, isValidBranchName } from '../utils/git'

export const description = 'Creates feature and release branches in Git repository'

export const args = {
  feature: {
    alias: 'f',
    description: 'Creates feature branch',
    type: 'boolean'
  },
  release: {
    alias: 'r',
    description: 'Creates release branch',
    type: 'boolean'
  }
}

export const run = async ({ _, feature, release }) => {
  if (feature && release) {
    console.error('Both the feature and release options cannot be selected at the same time.')
    process.exit(1)
  }

  let branchName

  if (feature || !release) {
    branchName = _.join('-')

    if (!branchName) {
      console.error(`${feature ? 'Feature' : 'Branch'} name required to create new${feature ? ' feature ' : ' '}branch.`)
      process.exit(1)
    }

    if (!(await isValidBranchName(branchName))) {
      console.error(`Invalid branch name: ${bold(branchName)}.`)
      process.exit(1)
    }

    if (feature) branchName = `feature/${branchName}`
  } else {
    const currentBranchName = await getCurrentBranchName()

    if (currentBranchName !== 'develop') {
      console.error(`Release branches must be created from the develop branch. Current branch is ${bold(currentBranchName)}.`)
      process.exit(1)
    }

    if (!(await isCodeCommitted())) {
      return [
        'echo Commit all changes before creating release branch:',
        'echo',
        'git status -s',
        'echo'
      ]
    }

    branchName = `release/${require('../../package.json').version.split('.').map((value, index) => index === 2 ? Number(value) + 1 : value).join('.')}`
  }

  if (await isExistingBranch(branchName)) return `git checkout ${branchName}`

  return `git checkout -b ${branchName}`
}
