'use strict'

function composeUsageInformation(...options)
{
  const {bold} = require('chalk')
  const {EOL} = require('os')
  const map = new Map(options)

  return {
    args: '[option]',
    body: `${bold('Options:')}${EOL}${EOL}${Array.from(map.keys()).map(key => `  ${bold(key)}    ${map.get(key)}`).join(EOL)}`
  }
}

module.exports = {composeUsageInformation}
