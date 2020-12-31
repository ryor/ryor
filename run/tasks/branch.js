import { bold } from 'chalk'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'
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
  const sequence = []

  if (feature && release) {
    console.error('Both the feature and release options cannot be selected at the same time.')
    process.exit(1)
  }

  if (feature || release) {
    let branchName, releaseVersion

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

      releaseVersion = require('../../package.json').version.split('.').map((value, index) => index === 2 ? Number(value) + 1 : value).join('.')

      branchName = `release/${releaseVersion}`
    }

    if (await isExistingBranch(branchName)) sequence.push(`git checkout ${branchName}`)

    else {
      if (release && !(await isCodeCommitted())) sequence.push('commit -t')

      sequence.push(`git checkout -b ${branchName}`)

      if (release) {
        sequence.push(
          async () => {
            const packageJSONPath = resolve('package.json')
            const packageJSON = require(packageJSONPath)

            packageJSON.version = releaseVersion

            await writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 2))
          },
        `commit Version ${releaseVersion}`
        )
      }

      sequence.push(`git push -u origin ${branchName}`)
    }
  }

  sequence.push('git branch --all')

  return sequence
}
