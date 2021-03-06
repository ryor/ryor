import { bold } from 'chalk'
import spawn from 'cross-spawn'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'

export const description = 'Runs preconfigured Git commands'

export const commands = {
  branch: {
    description: 'Creates branch',
    args: {
      feature: {
        alias: 'f',
        description: 'Feature branch name',
        type: 'string'
      },
      release: {
        alias: 'r',
        description: 'Creates release branch',
        type: 'boolean'
      }
    }
  },
  commit: {
    description: 'Commits all current changes to current branch',
    args: {
      build: {
        alias: 'b',
        description: 'Commit changes only if build completes successfully',
        type: 'boolean'
      },
      merge: {
        alias: 'm',
        description: 'Merges feature branch into develop branch or release branch into main (automatically includes testing and building before commit)',
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
  }
}

export const run = async ({ command, ...args }) => {
  let sequence

  switch (command) {
    case 'branch':
      sequence = await composeBranchSequence({ ...args, version: args._.join(' ').trim() })
      break

    case 'commit':
      sequence = await composeCommitSequence({ ...args, message: args._.join(' ').trim() })
      break
  }

  return sequence
}

export const composeBranchSequence = async ({ feature, release, version }) => {
  if (feature !== undefined && release === true) {
    return [
      'log -e Both the feature and release options cannot be selected at the same time.',
      'exit 1'
    ]
  }

  if (feature === undefined && !release) {
    return [
      'log -e Use either the feature (-f/--feature) or release (-r/--release) options to create a new branch.',
      'exit 1'
    ]
  }

  const sequence = []
  let branchName

  if (feature !== undefined) {
    if (feature === '') {
      return [
        'log -e Feature name required to create feature branch.',
        'exit 1'
      ]
    }

    branchName = `feature/${feature}`

    if (!(await isValidBranchName(branchName))) {
      return [
      `log -e Invalid feature name: ${bold(feature)}.`,
      'exit 1'
      ]
    }

    if (await isExistingBranch(branchName)) {
      return [
      `log -e Feature branch ${bold(branchName)} already exists.`,
      'exit 1'
      ]
    }
  } else {
    const currentBranchName = await getCurrentBranchName()

    if (currentBranchName !== 'develop') {
      return [
      `log -e Release branches must be created from the develop branch. Current branch is ${bold(currentBranchName)}.`,
      'exit 1'
      ]
    }

    const currentVersionParts = require('../../package.json').version.split('.').map(value => Number(value))
    let releaseVersion

    if (version) {
      const versionParts = version.split('.').map(value => Number(value))

      if (versionParts.length === 3 &&
      versionParts.every(value => Number.isInteger(value)) &&
      versionParts[0] >= currentVersionParts[0] &&
      versionParts[1] >= currentVersionParts[1] &&
      versionParts[2] >= currentVersionParts[2] &&
      versionParts.reduce((total, value) => total + value, 0) > currentVersionParts.reduce((total, value) => total + value, 0)) releaseVersion = version

      else {
        return [
        `log -e Invalid version ${bold(version)}`,
        'exit 1'
        ]
      }
    } else releaseVersion = require('../../package.json').version.split('.').map((value, index) => index === 2 ? Number(value) + 1 : value).join('.')

    branchName = `release/${releaseVersion}`

    if (await isExistingBranch(branchName)) {
      return [
      `log -e Release branch ${bold(branchName)} already exists.`,
      'exit 1'
      ]
    }

    sequence.push(
      async () => {
        const packageJSONPath = resolve('package.json')
        const packageJSON = require(packageJSONPath)

        packageJSON.version = releaseVersion

        await writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 2))
      },
      'git add -A',
      `git commit -m "Release ${releaseVersion}"`,
      'git push'
    )
  }

  sequence.push(
    `git checkout -b ${branchName}`,
    `git push -u origin ${branchName}`,
    'git branch'
  )

  return sequence
}

export const composeCommitSequence = async ({ build, merge, message, push, test }) => {
  const doPush = push || merge

  if (!doPush && !(await isCommitRequired())) return 'log No changes to commit'

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
      return [
      `log -e Merge only possible on feature or release branch; current branch is ${bold(currentBranchName)}.`,
      'exit 1'
      ]
    }
  } else if (push) sequence.push('git push')

  return sequence
}

const getCurrentBranchName = () => new Promise(resolve => spawn('git', ['branch', '--show-current']).stdout.on('data', data => resolve(data.toString().trim())))

const isCommitRequired = () => new Promise(resolve => {
  const childProcess = spawn('git', ['status', '-s'])
  let output = ''

  childProcess.stdout.on('data', data => { output += data.toString() })

  childProcess.on('close', () => resolve(output.trim() !== ''))
})

const isExistingBranch = name => new Promise(resolve => spawn('git', ['rev-parse', '--verify', name]).on('close', code => resolve(code === 0)))

const isValidBranchName = name => new Promise(resolve => spawn('git', ['check-ref-format', '--branch', name]).on('close', code => resolve(code === 0)))
