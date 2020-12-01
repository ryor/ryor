import { bold } from 'chalk'
import type { RunnableModule } from './types'

const USAGE_TIP_TEMPLATE:string = `Use ${bold.underline('node run help [NAME]')} for detailed usage information.`

export function composeRunnableDescription (name:string, runnableModule:RunnableModule, includeUsageTip:boolean = false):string {
  let description:string|undefined = typeof runnableModule.description === 'function'
    ? runnableModule.description()
    : typeof runnableModule.description === 'string'
      ? runnableModule.description
      : undefined

  if (typeof description !== 'string') description = ''

  if (runnableModule.args && includeUsageTip) {
    if (description) description += `${description.endsWith('.') ? '' : '.'} `

    description += USAGE_TIP_TEMPLATE.replace('[NAME]', name)
  }

  return description
}
