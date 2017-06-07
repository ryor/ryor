const {readFileSync, writeFileSync} = require('fs')
const {resolve} = require('path')
const packageJSONPath = resolve(__dirname, '../../../package.json')
const readmePath = resolve(__dirname, '../../../README.md')
const packageJSON = require(packageJSONPath)
const readme = readFileSync(readmePath).toString()
const currentVersion = packageJSON.version
const currentVersionParts = currentVersion.split('.')
const nextVersion = `${currentVersionParts[0]}.${currentVersionParts[1]}.${Number(currentVersionParts[2]) + 1}`

packageJSON.version = nextVersion
packageJSON.devDependencies.ryor = currentVersion

writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2))
writeFileSync(readmePath, readme.replace(new RegExp(currentVersion, 'g'), nextVersion))
