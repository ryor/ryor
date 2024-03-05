export const description = 'Checks for dependency updates with npm-check-updates and installs any available updates with NPM or PNPM'

export async function run() {
  const { stat } = await import('node:fs/promises')
  const initialPackageJSONModifiedTime = (await stat('package.json')).mtimeMs
  let usePNPM = true

  try {
    await stat('pnpm-lock.yaml')
  } catch (error) {
    usePNPM = false
  }

  return [
    `log Checking for dependency updates...`,
    'npm-check-updates -u',
    async () => {
      // prettier-ignore
      if ((await stat('package.json')).mtimeMs > initialPackageJSONModifiedTime) {
        return [
          `log Updating dependencies...`,
          `${usePNPM ? 'p' : ''}npm install`,
          `log Auditing dependencies...`,
          `${usePNPM ? 'p' : ''}npm audit --fix`,
          'log All dependencies match the latest package versions.'
        ]
      }
    }
  ]
}
