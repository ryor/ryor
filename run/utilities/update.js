export const description = 'Checks for dependency updates and optionally updates package.json and installs updates'

export const args = {
  install: {
    alias: 'i',
    description: 'Installs updates if any are available'
  }
}

export async function run ({ install }) {
  if (!install) return 'npm-check-updates'

  const { stat } = await import('fs/promises')
  const previousModifiedTime = (await stat('package.json')).mtimeMs

  return [
    'npm-check-updates -u',
    async () => {
      const currentModifiedTime = (await stat('package.json')).mtimeMs

      if (currentModifiedTime > previousModifiedTime) return 'npm install'
    }
  ]
}
