'use strict'

const description = 'Increments semver patch number in package.json file'

function run()
{
  const {readFileSync, writeFileSync} = require('fs')
  const {resolve} = require('path')
  const packageJSONPath = resolve(__dirname, '../../package.json')
  const packageJSON = require(packageJSONPath)
  const semverParts = packageJSON.version.split('.')

  packageJSON.version = `${semverParts[0]}.${semverParts[1]}.${Number(semverParts[2]) + 1}`

  writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2))
}

module.exports = {description, run}
