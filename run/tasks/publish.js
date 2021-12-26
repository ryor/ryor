export const description = 'Publishes latest build to npm registry'

export const run = [
  'cd build',
  async () => {
    const { promises: { writeFile } } = await import('fs')

    await writeFile('.npmrc', `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`)
  },
  'npm publish'
]
