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
  const { mtimeMs: previousModifiedTime } = await stat('package.json')

  return [
    'npm-check-updates -u',
    async () => {
      if ((await stat('package.json')).mtimeMs > previousModifiedTime) return ['npm install --force', 'npm audit fix --force']
    }
  ]
}
