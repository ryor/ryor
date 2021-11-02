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

const importChalk = async () => (await import('chalk')).default

export const alert = async message => {
  const { bold } = await importChalk()

  console.warn(`${bold.yellow('⚠')} ${bold(message)}`)
}

export const error = async message => {
  const { bold } = await importChalk()

  console.error(`${bold.red('X')} ${bold(message)}`)
}

export const info = async message => {
  const { bold } = await importChalk()

  console.log(`${bold.cyan('•')} ${bold(message)}`)
}

export const success = async message => {
  const { bold } = await importChalk()

  console.log(`${bold.green('✓')} ${bold(message)}`)
}

export const wait = async message => {
  const { bold } = await importChalk()

  console.log(`${bold.cyan('⏳')} ${bold(message)}`)
}

export default { alert, error, info, success, wait }

export const run = async ({ _, ...args }) => {
  const message = _.join(' ')

  if (args.alert) await alert(message)

  else if (args.error) await error(message)

  else if (args.success) await success(message)

  else if (args.wait) await wait(message)

  else await info(message)
}
