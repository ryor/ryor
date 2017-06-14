const description = 'Incremements semver patch numbers for both the package file and the ryor development dependency listed in it'

function run()
{
  return () =>
  {
    const {readFileSync, writeFileSync} = require('fs')
    const {resolve} = require('path')
    const packageJSONPath = resolve(__dirname, '../../package.json')
    const readmePath = resolve(__dirname, '../../README.md')
    const packageJSON = require(packageJSONPath)
    const readme = readFileSync(readmePath).toString()
    const currentVersion = packageJSON.version
    const currentVersionParts = currentVersion.split('.')
    const nextVersion = `${currentVersionParts[0]}.${currentVersionParts[1]}.${Number(currentVersionParts[2]) + 1}`

    packageJSON.version = nextVersion
    packageJSON.devDependencies.ryor = currentVersion

    console.log(`Patching to version ${nextVersion}`)

    writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2))
    writeFileSync(readmePath, readme.replace(new RegExp(currentVersion, 'g'), nextVersion))
  }
}

module.exports = {description, run}
