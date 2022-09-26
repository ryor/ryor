export const description = 'Displays Git branches or creates and/or switches to feature or fix branches'

export const args = {
  feature: {
    alias: 'f',
    description: 'Creates and/or switches to feature branch',
    type: 'boolean'
  },
  fix: {
    alias: 'x',
    description: 'Creates and/or switches to fix branch',
    type: 'boolean'
  },
  release: {
    alias: 'r',
    description: 'Creates and/or switches to release branch',
    type: 'boolean'
  }
}

export async function run({ _, ...args }) {
  if (['feature', 'fix', 'release'].filter((type) => args[type]).length > 1) return 'log -e Only one branch type may be specified at a time'

  const { feature, fix, release } = args

  if (feature || fix) {
    if (_.length === 0) return `log -e Valid ${feature ? 'feature' : 'fix'} name required`

    const { getAllBranches, isValidBranchName } = await import('./shared.js')
    const { local, remote } = await getAllBranches()
    const featureOrFixName = _[0]
    const requestedBranch = `${feature ? 'feature' : 'fix'}/${featureOrFixName}`

    if (local.includes(requestedBranch)) return [`git checkout ${requestedBranch}`, 'git branch --all']
    else if (remote.includes(requestedBranch)) return [`git checkout ${requestedBranch}`, 'git pull', 'git branch --all']
    else if (!(await isValidBranchName(requestedBranch))) return `log -e Invalid ${feature ? 'feature' : 'fix'} name: ${featureOrFixName}`
    else return [`git checkout -b ${requestedBranch}`, `git push --set-upstream origin ${requestedBranch}`, 'git branch --all']
  }

  if (release) {
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
      `git checkout -b release/v${releaseVersion}`,
      `git push --set-upstream origin release/v${releaseVersion}`,
      'git branch --all'
    ]
  }

  if (_.length > 0) {
    const { getAllBranches } = await import('./shared.js')
    const { local } = await getAllBranches()
    const requestedBranch = _[0]

    if (local.includes(requestedBranch)) return [`git checkout ${requestedBranch}`, 'git branch --all']
  }

  return 'git branch --all'
}
