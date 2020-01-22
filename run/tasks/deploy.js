'use strict'

module.exports = {
  description: 'Publishes latest build to npm registry',
  run: [
    'shx cp package.json README.md build',
    () => require('fs').writeFileSync('build/.npmrc', '//registry.npmjs.org/:_authToken=${NPM_TOKEN}'),
    'cd build',
    'npm publish'
  ]
}
