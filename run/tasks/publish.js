'use strict'

module.exports = {
  description: 'Publishes latest build to npm registry',
  run: [
    'cd build',
    // eslint-disable-next-line no-template-curly-in-string
    () => require('fs').writeFileSync('.npmrc', '//registry.npmjs.org/:_authToken=${NPM_TOKEN}')
    // 'npm publish'
  ]
}
