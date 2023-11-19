export const description = 'Creates release and tag'

export async function run() {
  const [{ checkoutBranch, getCurrentBranch, isCommitRequired, isPullRequired, pull }, log] = await Promise.all([
    import('./shared.js'),
    import('../utilities/log.js')
  ])
  const currentBranch = await getCurrentBranch()

  if (currentBranch !== 'develop') await checkoutBranch('develop')

  if (await isPullRequired()) await pull()

  if (await isCommitRequired()) {
    log.error('Resolve uncommitted changes on develop branch before creating release\n')

    return 'git status -s'
  }

  return [
    'test -f',
    async () => {
      const [{ readFile, writeFile }, { commit, createVersionTag, getAllTags, mergeBranch }, log] = await Promise.all([
        import('fs/promises'),
        import('./shared.js'),
        import('../utilities/log.js')
      ])
      const [tags, packageBuffer] = await Promise.all([getAllTags(), readFile('package.json')])
      const packageJSON = JSON.parse(packageBuffer)
      let releaseVersion = packageJSON.version

      while (tags.includes(`v${releaseVersion}`)) {
        releaseVersion = releaseVersion
          .split('.')
          .map((value, index) => (index === 2 ? Number(value) + 1 : value))
          .join('.')
      }

      if (packageJSON.version !== releaseVersion) {
        packageJSON.version = releaseVersion

        await writeFile('package.json', JSON.stringify(packageJSON, null, '  '))
      }

      await commit(`Release v${releaseVersion}`, true, true)

      await checkoutBranch('main')

      if (await isPullRequired()) await pull()

      log.wait(`Merging Release v${releaseVersion} into main branch...`)

      await mergeBranch('develop', `Release v${releaseVersion}`)

      log.wait(`Creating v${releaseVersion} tag...`)

      await createVersionTag(releaseVersion)

      await checkoutBranch('develop')
    }
  ]
}
