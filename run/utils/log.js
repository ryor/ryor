import chalk from 'chalk'

const { bold, cyan } = chalk

export const description = 'Logs messages with a bit of formatting'

export const args = {
  success: {
    alias: 's',
    description: 'Adds checkmark character to message',
    type: 'boolean'
  },
  wait: {
    alias: 'w',
    description: 'Adds hourglass character to message',
    type: 'boolean'
  }
}

export const success = message => console.log(`${cyan('✓')} ${bold(message)}`)

export const wait = message => console.log(`${cyan('⏳')} ${bold(message)}`)

export const run = ({ _, ...args }) => {
  const message = _.join(' ')

  if (args.success) success(message)

  else if (args.wait) wait(message)

  else console.log(`${cyan('•')} ${bold(message)}`)
}
