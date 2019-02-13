'use strict'

const description = 'Runs preconfigured NPM publish command'

function usage () {
  return require('../../utils/usage').composeUsageInformation(undefined, [['publish', 'Publishes latest build to NPM']])
}

function run (args) {
  const { bold } = require('chalk')

  if (args.length === 0 || args[0] !== 'publish') {
    let errorMessage = `The ${bold('publish')} command is required to use the ${bold('npm')} tool.`

    if (args.length > 0) errorMessage += ` Received ${bold(args[0])}.`

    throw new Error(errorMessage)
  }

  const { existsSync } = require('fs')
  const { resolve } = require('path')
  const buildDirectoryPath = resolve(process.cwd(), 'build')

  if (!existsSync(buildDirectoryPath) || !existsSync(resolve(buildDirectoryPath, 'index.js'))) { throw new Error(`Module not found. Make sure to run ${bold('build')} before running ${bold('npm publish')}.`) }

  if (!process.env.NPM_TOKEN) throw new Error(`${bold('NPM_TOKEN')} environment variable required for ${bold('npm publish')} is not set.`)

  return ['log -w Publishing to NPM', 'shx cp -rf package.json README.md run/tools/npm/.npmrc build', 'cd build', 'npm publish', 'cd ..']
}

module.exports = { description, run, usage }
