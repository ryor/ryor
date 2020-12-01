import { bold } from 'chalk'
import { EOL } from 'os'
import { composeRunnableDescription } from './composeRunnableDescription'
import { resolveRunnableModule } from './resolveRunnableModule'
import type { RunnableModule } from './types'

const ERROR_TEMPLATE:string = `Runnable ${bold('[NAME]')} could not be resolved.`

const HEADER_TEMPLATE:string = `${bold('Usage:')} node run ${bold('[NAME]')}`

const SPACER:string = '  '

export async function composeRunnableUsageInformation (name:string):Promise<string> {
  const runnableModule:RunnableModule|undefined = await resolveRunnableModule(name)

  if (!runnableModule) throw new Error(ERROR_TEMPLATE.replace('[NAME]', name))

  const description:string = composeRunnableDescription(name, runnableModule)
  let header:string = HEADER_TEMPLATE.replace('[NAME]', name)
  let body:string|undefined

  if (runnableModule.args) {
    const { args }:RunnableModule = runnableModule
    const keys:string[] = Object.keys(args).sort()

    if (keys.length > 0) {
      let maxOptionsLength:number = 0

      header += ' [options]'

      body = keys
        .map((key:string):string[] => {
          const short:string = args[key].alias ? `-${args[key].alias}` : ''
          const long:string = `--${key}`
          const description:string = args[key].description || ''
          const optionsLength:number = `${short}${SPACER}${long}`.length

          if (optionsLength > maxOptionsLength) maxOptionsLength = optionsLength

          return [short, long, description]
        })
        .map(([short, long, description]:string[]):string => {
          const options:string = `${short}${SPACER}${long}`

          return `${options}${' '.repeat(maxOptionsLength - options.length)}${description ? `${SPACER + description}` : ''}`
        })
        .join('\n')
    }
  }

  return [header]
    .concat(description || [])
    .concat(body || [])
    .join(EOL + EOL)
}
