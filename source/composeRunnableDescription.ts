import { bold } from 'chalk'
import type { Configuration, RunnableModule } from './types'

const USAGE_TIP_TEMPLATE: string = `Use ${bold.underline('node [ENTRY_DIRECTORY_NAME] help [NAME]')} for detailed usage information.`

export function composeRunnableDescription (name: string, runnableModule: RunnableModule, configuration: Configuration, includeUsageTip: boolean = false): string {
  let description: string | undefined = typeof runnableModule.description === 'function'
    ? runnableModule.description()
    : typeof runnableModule.description === 'string'
      ? runnableModule.description
      : undefined

  if (typeof description !== 'string') description = ''

  if (runnableModule.args && includeUsageTip) {
    if (description) description += `${description.endsWith('.') ? '' : '.'} `

    description += USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', configuration.entry.directoryName).replace('[NAME]', name)
  }

  return description
}
