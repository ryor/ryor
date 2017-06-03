const {writeFileSync} = require('fs')
const {resolve} = require('path')
const packageJSONPath = resolve(__dirname, '../../package.json')
const packageJSON = require(packageJSONPath)
let semver

semver = packageJSON.version.split('.')
packageJSON.version = `${semver[0]}.${semver[1]}.${Number(semver[2]) + 1}`

semver = packageJSON.devDependencies.ryor.split('.')
packageJSON.devDependencies.ryor = `${semver[0]}.${semver[1]}.${Number(semver[2]) + 1}`

writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2))
