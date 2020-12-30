export const description = 'Publishes latest build to npm registry'

export const run = [
  'test -c',
  () => {
    const { version } = require('../../package.json')

    return [
      `git tag -a v${version} -m "Version ${version}"`,
      `git push origin v${version}`
    ]
  },
  'build',
  () => require('fs').writeFileSync('.npmrc', `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`),
  'npm publish'
]
