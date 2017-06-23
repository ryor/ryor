const description = 'Publishes latest version to NPM'

function run()
{
  const {existsSync} = require('fs')
  const {resolve} = require('path')
  const buildDirectoryPath = resolve(process.cwd(), 'build')

  if (!existsSync(buildDirectoryPath)
  || !existsSync(resolve(buildDirectoryPath, 'index.js'))
  || !existsSync(resolve(buildDirectoryPath, 'package.json')))
  {
    const {bold} = require('chalk')

    throw new Error(`Files required for npm publish were not found. Expected ${bold('build/index.js')} and ${bold('build/package.json')}.`)
  }

  return [
    'shx cp -rf README.md run/tools/publish/.npmrc build',
    'cd build',
    'npm publish'
  ]
}

module.exports = {description, run}
