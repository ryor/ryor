import { bold } from 'chalk'
import { EOL } from 'os'
import { composeRunnableDescription } from './composeRunnableDescription'
import { resolveRunnableModule } from './resolveRunnableModule'
import type { RunnableModule, Usage } from './types'

const ERROR_TEMPLATE:string = `Runnable ${bold('[NAME]')} could not be resolved.`

const HEADER_TEMPLATE:string = `${bold('Usage:')} node run ${bold('[NAME]')}`

export async function composeRunnableUsageInformation (name:string):Promise<string> {
  const runnableModule:RunnableModule|undefined = await resolveRunnableModule(name)

  if (!runnableModule) throw new Error(ERROR_TEMPLATE.replace('[NAME]', name))

  let header:string = HEADER_TEMPLATE.replace('[NAME]', name)
  const description:string = composeRunnableDescription(name, runnableModule)
  let body:string|undefined

  if (runnableModule.usage) {
    const usage:Usage = typeof runnableModule.usage === 'function' ? runnableModule.usage() : runnableModule.usage

    if (typeof usage === 'string') body = usage
    else {
      if (usage.args) header += ` ${usage.args}`
      if (usage.body) body = usage.body
    }
  }

  return [header]
    .concat(description ? [description] : [])
    .concat(body ? [body] : [])
    .join(EOL + EOL)
}
