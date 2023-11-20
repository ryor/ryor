export const description = 'Creates release branch and tag'

export async function run() {
  const [{ checkoutBranch, commit, createBranch, createTag, doesTagExist, fetchAll, getAllBranches, getCurrentBranch, isCommitRequired }, log] =
    await Promise.all([import('./shared.js'), import('../utilities/log.js')])
  const [{ local }, currentBranch] = await Promise.all([getAllBranches(), getCurrentBranch()])
  let releaseBranch = local.find((branch) => branch.startsWith('release'))

  if (releaseBranch) {
    if (currentBranch !== releaseBranch) await checkoutBranch(releaseBranch)

    return 'git branch --all'
  }

  log.wait('Fetching remote branches...')

  await fetchAll()

  const { remote } = await getAllBranches()

  releaseBranch = remote.find((branch) => branch.startsWith('release'))

  if (releaseBranch) {
    if (currentBranch !== releaseBranch) await checkoutBranch(releaseBranch)

    return 'git branch --all'
  }

  await checkoutBranch('develop')

  if (await isCommitRequired()) {
    log.error('Resolve uncommitted changes on develop branch before creating release')
    return
  }

  const { readFile, writeFile } = await import('fs/promises')
  const packageJSON = JSON.parse(await readFile('package.json'))
  let releaseVersion = packageJSON.version

  while (await doesTagExist(`v${releaseVersion}`)) {
    releaseVersion = releaseVersion
      .split('.')
      .map((value, index) => (index === 2 ? Number(value) + 1 : value))
      .join('.')
  }

  packageJSON.version = releaseVersion

  await writeFile('package.json', JSON.stringify(packageJSON, null, '  '))

  log.wait(`Creating commit for version ${releaseVersion}...`)

  await commit(`Release v${releaseVersion}`)

  releaseBranch = `release/${releaseVersion}`

  log.wait(`Creating ${releaseBranch} branch...`)

  await createBranch(`release/${releaseVersion}`)

  log.wait(`Creating v${releaseVersion} tag...`)

  await createTag(releaseVersion)

  return 'git branch --all'
}
