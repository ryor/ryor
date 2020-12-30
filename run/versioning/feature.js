import { bold } from 'chalk'
import spawn from 'cross-spawn'

export const description = 'Initializes and finalizes feature branches in Git repository'

export const args = {
  finalize: {
    alias: 'f',
    description: 'Finalize feature branch',
    type: 'boolean'
  }
}

export const run = async ({ _, finalize }) => {
  const sequence = []
  let featureName = _.join('-')
  let featureBranchName

  if (finalize) {
    if (featureName) {
      if (await isExistingFeature(featureName)) featureBranchName = `features/${featureName}`
      else {
        console.error(`Branch for feature ${bold(featureName)} does not exist`)
        process.exit(1)
      }
    } else {
      const currentBranchName = await getCurrentBranchName()

      if (currentBranchName.startsWith('feature/')) {
        featureBranchName = currentBranchName
        featureName = featureBranchName.split('feature/')[1]
      } else {
        console.error(`Current branch ${bold(currentBranchName)} is not a feature branch`)
        process.exit(1)
      }
    }

    if (!(await isCodeCommitted())) {
      sequence.push(
        'git add --all',
      `git commit -am "Final commit to ${featureBranchName} before merge with develop"`
      )
    }

    sequence.push(
      'git checkout develop',
      'git pull',
      `git merge --squash ${featureBranchName}`,
      'git commit',
      'git push',
      `git branch -D ${featureBranchName}`,
      `git push origin --delete ${featureBranchName}`,
      `log -s Feature ${featureName} merged into develop branch`
    )
  } else {
    const featureNameIsValid = !!featureName && await isValidFeatureName(featureName)

    if (!featureNameIsValid) {
      console.error(featureName ? `Invalid feature name: ${bold(featureName)}` : 'Valid feature name required')
      process.exit(1)
    }

    if (await isExistingFeature(featureName)) {
      console.error(`Feature ${bold(featureName)} already exists`)
      process.exit(1)
    }

    featureBranchName = `feature/${featureName}`

    sequence.push(
      'git checkout develop',
      'git pull',
      `git checkout -b ${featureBranchName}`,
      `git push -u origin ${featureBranchName}`,
      `log -s Feature branch ${bold(featureBranchName)} created`
    )
  }

  return sequence
}

const isCodeCommitted = () => new Promise(resolve => spawn('git', ['status', '-s']).stdout.on('data', data => resolve(data.toString().trim() === '')))

const isExistingFeature = name => new Promise(resolve => spawn('git', ['rev-parse', '--verify', `feature/${name}`]).on('close', code => resolve(code === 0)))

const isValidFeatureName = name => new Promise(resolve => spawn('git', ['check-ref-format', '--branch', `feature/${name}`]).on('close', code => resolve(code === 0)))

const getCurrentBranchName = () => new Promise(resolve => spawn('git', ['branch', '--show-current']).stdout.on('data', data => resolve(data.toString().trim())))
