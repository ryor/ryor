'use strict'

const description = 'Publishes latest version to NPM'

function run()
{
  const {existsSync} = require('fs')
  const {resolve} = require('path')
  const buildDirectoryPath = resolve(process.cwd(), 'build')

  if (!existsSync(buildDirectoryPath)
  || !existsSync(resolve(buildDirectoryPath, 'index.js')))
  {
    const {bold} = require('chalk')

    throw new Error(`File required for npm publish was not found. Expected ${bold('build/index.js')}.`)
  }

  return [
    'log -w Publishing to NPM',
    'shx cp -rf package.json README.md run/tasks/publish/.npmrc build',
    'cd build',
    'npm publish'
  ]
}

module.exports = {description, run}
