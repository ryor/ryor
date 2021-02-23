import { bold } from 'chalk'

export const description = 'Logs messages with a bit of formatting'

export const args = {
  alert: {
    alias: 'a',
    description: 'Outputs an alert message',
    type: 'boolean'
  },
  error: {
    alias: 'e',
    description: 'Outputs an error message',
    type: 'boolean'
  },
  success: {
    alias: 's',
    description: 'Outputs a success message',
    type: 'boolean'
  },
  wait: {
    alias: 'w',
    description: 'Outputs a wait message',
    type: 'boolean'
  }
}

export const alert = message => console.warn(`${bold.yellow('⚠')} ${bold(message)}`)

export const error = message => console.error(`${bold.red('X')} ${bold(message)}`)

export const info = message => console.log(`${bold.cyan('•')} ${bold(message)}`)

export const success = message => console.log(`${bold.green('✓')} ${bold(message)}`)

export const wait = message => console.log(`${bold.cyan('⏳')} ${bold(message)}`)

export default { alert, error, info, success, wait }

export const run = ({ _, ...args }) => {
  const message = _.join(' ')

  if (args.alert) alert(message)

  else if (args.error) error(message)

  else if (args.success) success(message)

  else if (args.wait) wait(message)

  else info(message)
}
