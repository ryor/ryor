import { getAllTags } from './shared.js'

export const description = 'Creates tagged release. Current version patch number is bumped if version not specified.'

export const args = {
  version: {
    alias: 'v',
    description: 'Specific release version',
    type: 'string'
  }
}

export async function run({ version }) {
  const log = await import('../utilities/log.js')

  if (version) {
    if (
      !version.includes('.') ||
      version.split('.').length !== 3 ||
      version.split('.').findIndex((value) => !Number.isInteger(parseInt(value)) || Number(value) < 0) > -1
    ) {
      log.error(`Invalid version: "${version}". Semver value required.`)
      return
    }

    // Ensuring integer values with no leading zeros
    version = version
      .split('.')
      .map((value) => parseInt(value))
      .join('.')
  }

  // prettier-ignore
  const [{ readFile, writeFile }, { checkoutBranch, commit, createVersionTag, getCurrentBranch, isCommitRequired, isPullRequired, mergeBranch, pull }] = await Promise.all([import('fs/promises'), import('./shared.js')])
  const currentBranch = await getCurrentBranch()

  if (currentBranch !== 'develop') await checkoutBranch('develop')

  if (await isPullRequired()) await pull()

  if (await isCommitRequired()) {
    log.error('Resolve uncommitted changes on develop branch before creating release\n')

    return 'git status -s'
  }

  const [tags, packageBuffer] = await Promise.all([getAllTags(), readFile('package.json')])
  const packageJSON = JSON.parse(packageBuffer)

  if (version) {
    if (tags.includes(`v${version}`)) {
      log.error(`Tag v${version} already exists.`)
      return
    }
  } else {
    version = packageJSON.version

    while (tags.includes(`v${version}`)) {
      version = version
        .split('.')
        .map((value, index) => (index === 2 ? parseInt(value) + 1 : value))
        .join('.')
    }
  }

  return [
    'test -f',
    async () => {
      packageJSON.version = version

      await writeFile('package.json', JSON.stringify(packageJSON, null, '  '))

      await commit(`Release v${version}`, true, true)

      await checkoutBranch('main')

      if (await isPullRequired()) await pull()

      log.wait(`Merging Release v${version} into main branch...`)

      await mergeBranch('develop', `Release v${version}`)

      log.wait(`Creating v${version} tag...`)

      await createVersionTag(version)

      await checkoutBranch('develop')
    }
  ]
}
