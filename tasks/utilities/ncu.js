export const description = 'Checks for dependency updates and optionally updates package.json and installs updates'

export const args = {
  update: {
    alias: 'u',
    description: 'Updates package.json and installs latest packages'
  }
}

export async function run({ update }) {
  if (!update) return 'npm-check-updates'

  const { stat } = await import('fs/promises')
  const previousModifiedTime = (await stat('package.json')).mtimeMs

  return [
    'npm-check-updates -u',
    async () => {
      const currentModifiedTime = (await stat('package.json')).mtimeMs

      if (currentModifiedTime > previousModifiedTime) return 'npm install --force'
    }
  ]
}
