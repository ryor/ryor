'use strict'

function composeUsageInformation(options, commands)
{
  const {bold} = require('chalk')
  const {EOL} = require('os')
  const {composeUsageDetailsList} = require('ryor')
  const args = []
  const lists = []
  let type

  if (options)
  {
    type = `option${options.length > 1 ? 's' : ''}`
    args.push(`[${type}]`)
    lists.push(composeUsageDetailsList(options, type))
  }

  if (commands)
  {
    type = `command${commands.length > 1 ? 's' : ''}`
    args.push(bold('<command>'))
    lists.push(composeUsageDetailsList(commands, type))
  }

  return {
    args: args.join(' '),
    body: lists.join(`${EOL}${EOL}`)
  }
}

module.exports = {composeUsageInformation}
