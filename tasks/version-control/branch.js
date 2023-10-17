import { getCurrentBranch } from './shared.js'

export const description = 'Displays Git branches or creates and/or switches to bugfix, chore, feature, hotfix or release branches'

export const args = {
  bugfix: {
    alias: 'b',
    description: 'Creates and/or switches to bugfix branch',
    type: 'boolean'
  },
  chore: {
    alias: 'c',
    description: 'Creates and/or switches to chore branch',
    type: 'boolean'
  },
  feature: {
    alias: 'f',
    description: 'Creates and/or switches to feature branch',
    type: 'boolean'
  },
  hotfix: {
    alias: 'x',
    description: 'Creates and/or switches to hotfix branch',
    type: 'boolean'
  },
  release: {
    alias: 'r',
    description: 'Creates and/or switches to release branch',
    type: 'boolean'
  }
}

export async function run({ _, ...args }) {
  const branchPart = _[0]
  const types = ['bugfix', 'chore', 'feature', 'hotfix', 'release'].filter((type) => args[type])

  if (types.length === 0) {
    const sequence = ['git branch --all']

    if (branchPart) {
      const { getAllBranches } = await import('./shared.js')
      const { local } = await getAllBranches()
      const branch = local.find((name) => name.startsWith(branchPart))

      if (branch) sequence.unshift(`git checkout ${branch}`)
    }

    return sequence
  }

  if (types.length > 1) return 'log -e Only one branch type may be specified at a time'

  const type = types[0]

  if (type === 'release') {
    const [{ readFile, writeFile }, { doesTagExist, getAllBranches, getCurrentBranch }] = await Promise.all([import('fs/promises'), import('./shared.js')])
    const { local, remote } = await getAllBranches()
    let existingRelease = local.find((branch) => branch.startsWith('release'))

    if (existingRelease) return [`git checkout ${existingRelease}`, 'git branch --all']

    existingRelease = remote.find((branch) => branch.startsWith('release'))

    if (existingRelease) return [`git checkout ${existingRelease}`, 'git pull', 'git branch --all']

    if ((await getCurrentBranch()) !== 'develop') return 'log -e Release branches can only be created from the develop branch'

    const packageJSON = JSON.parse(await readFile('package.json'))
    let releaseVersion = packageJSON.version

    while (await doesTagExist(`v${releaseVersion}`))
      releaseVersion = releaseVersion
        .split('.')
        .map((value, index) => (index === 2 ? Number(value) + 1 : value))
        .join('.')

    const releaseBranch = `release/${releaseVersion}`

    if (local.includes(releaseBranch)) return [`git checkout ${releaseBranch}`, 'git branch --all']
    else if (remote.includes(releaseBranch)) return [`git checkout ${releaseBranch}`, 'git pull', 'git branch --all']

    packageJSON.version = releaseVersion

    await writeFile('package.json', JSON.stringify(packageJSON, null, '  '))

    return [
      `commit -p "Release ${releaseVersion}"`,
      `git checkout -b release/${releaseVersion}`,
      `git push --set-upstream origin release/${releaseVersion}`,
      'git branch --all'
    ]
  } else {
    const { getAllBranches, isValidBranchName } = await import('./shared.js')
    const { local, remote } = await getAllBranches()
    const branch = `${type}/${branchPart}`

    if (local.includes(branch)) return [`git checkout ${branch}`, 'git branch --all']
    else if (remote.includes(branch)) return [`git checkout ${branch}`, 'git pull', 'git branch --all']
    else if (!(await isValidBranchName(branch))) return `log -e Invalid ${type} name: ${branchPart}`
    else {
      const requiredSourceBranch = type === 'hotfix' ? 'release' : 'develop'

      if ((await getCurrentBranch()) !== requiredSourceBranch) return `log -e A ${type} branche can only be created from the ${requiredSourceBranch} branch`

      return [`git checkout -b ${branch}`, `git push --set-upstream origin ${branch}`, 'git branch --all']
    }
  }
}
