'use strict'

module.exports = {
  description: 'Publishes latest build to npm registry',
  run: [
    'cd build',
    () => require('fs').writeFileSync('.npmrc', `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`),
    'npm publish'
  ]
}
