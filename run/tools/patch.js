const description = 'Increments semver patch numbers in package.json file'

function run()
{
  const {readFileSync, writeFileSync} = require('fs')
  const {resolve} = require('path')
  const packageJSONPath = resolve(__dirname, '../../package.json')
  const packageJSON = require(packageJSONPath)
  const currentVersion = packageJSON.version
  const currentVersionParts = currentVersion.split('.')
  const nextVersion = `${currentVersionParts[0]}.${currentVersionParts[1]}.${Number(currentVersionParts[2]) + 1}`

  packageJSON.version = nextVersion
  packageJSON.devDependencies.ryor = currentVersion

  writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2))
}

module.exports = {description, run}
