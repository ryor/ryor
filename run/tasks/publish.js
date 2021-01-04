export const description = 'Publishes latest build to npm registry'

export const run = [
  'cd build',
  () => require('fs').writeFileSync('.npmrc', `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`),
  'npm publish'
]
