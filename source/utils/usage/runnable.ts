import {bold} from 'chalk'
import {EOL} from 'os'
import {resolveRunnableModule} from '../modules'

export const RUNNABLE_USAGE_INFORMATION_HEADER:string = `${bold('Usage:')} node run [NAME]`

export function composeRunnableUsageInformation(name:string):string
{
  const runnableModule:RunnableModule|undefined = resolveRunnableModule(name)
  let header:string = RUNNABLE_USAGE_INFORMATION_HEADER.replace('[NAME]', bold(name))
  let description:string|undefined
  let body:string|undefined

  if (runnableModule !== undefined)
  {
    let {usage}:RunnableModule = runnableModule

    if (runnableModule.description !== undefined)
      description = typeof runnableModule.description === 'function' ? runnableModule.description() : runnableModule.description

    if (usage !== undefined)
    {
      if (typeof usage === 'function')
        usage = usage()

      if (typeof usage === 'string')
        body = usage

      else
      {
        if (usage.args !== undefined)
          header += ` ${usage.args}`

        if (usage.body !== undefined)
          body = usage.body
      }
    }
  }

  return [header]
    .concat(description !== undefined ? [description] : [])
    .concat(body !== undefined ? [body] : [])
    .join(`${EOL}${EOL}`)
}
