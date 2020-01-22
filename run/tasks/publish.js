'use strict'

module.exports = {
  description: 'Publishes latest build to npm registry',
  run: () => {
    const { copyFileSync, readFileSync, writeFileSync } = require('fs')

    return [
      () => {
        const json = JSON.parse(readFileSync('package.json'))

        delete json.devDependencies

        json.bin = {
          "ryor": "./cli"
        }

        copyFileSync('README.md', 'build/README.md')
        // eslint-disable-next-line no-template-curly-in-string
        writeFileSync('build/.npmrc', '//registry.npmjs.org/:_authToken=${NPM_TOKEN}')
        writeFileSync('build/cli.js', '#!/usr/bin/env node\nrequire("./index").run()')
        writeFileSync('build/package.json', JSON.stringify(json, null, ' '))
      },
      // 'cd build',
      // 'npm publish'
    ]
  }
}
