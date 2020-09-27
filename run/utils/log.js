const { bold, cyan } = require('chalk')

export const description = 'Logs messages with a bit of formatting'

export const usage = () => require('./usage').composeUsageInformation([
  ['-w  --wait', 'Adds hourglass character to message'],
  ['-s  --success', 'Adds checkmark character to message']
])

export const success = message => console.log(`${cyan('✓')} ${bold(message)}`)

export const wait = message => console.log(`${cyan('⏳')} ${bold(message)}`)

export const run = args => {
  const parsedArgs = require('minimist')(args, {
    alias: { s: 'success', w: 'wait' },
    boolean: ['s', 'success', 'w', 'wait']
  })
  const message = parsedArgs._.join(' ')

  if (parsedArgs.success) success(message)

  else if (parsedArgs.wait) wait(message)

  else console.log(`${cyan('•')} ${bold(message)}`)
}
