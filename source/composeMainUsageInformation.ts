import { bold } from 'chalk'
import { EOL } from 'os'
import { composeRunnableDescription } from './composeRunnableDescription'
import { composeUsageInformationList } from './composeUsageInformationList'
import { resolveAllRunnableModules } from './resolveAllRunnableModules'
import type { RunnableModule, UsageConfiguration } from './types'

export const HEADER:string = `${bold('Usage:')} node run [option] <runnable> [args...] [+ <runnable> [args...]] ...`

export const NO_RUNNABLES_RESOLVED_MESSAGE:string = 'No runnables found.'

export async function composeMainUsageInformation (configuration?:UsageConfiguration):Promise<string> {
  const allModules:Map<string, Map<string, RunnableModule>> = await resolveAllRunnableModules()

  if (allModules.size === 0) return NO_RUNNABLES_RESOLVED_MESSAGE

  const sortedModules:Map<string, Map<string, RunnableModule>> = new Map()
  const untypedModules = allModules.get('untyped')
  let minNameLength:number = 0
  let body:string = ''

  if (untypedModules) allModules.delete('untyped')

  const lists:string[] = []

  if (configuration && configuration.types && configuration.types.order) {
    configuration.types.order.forEach((type:string):void => {
      if (allModules.has(type)) {
        sortedModules.set(type, allModules.get(type)!)
        allModules.delete(type)
      }
    })
  }

  allModules.forEach((map:Map<string, RunnableModule>, type:string):Map<string, Map<string, RunnableModule>> => sortedModules.set(type, map))

  if (untypedModules) sortedModules.set(sortedModules.size > 0 ? 'other' : 'untyped', untypedModules)

  sortedModules.forEach((typeModules:Map<string, RunnableModule>):void =>
    typeModules.forEach((_, name:string):void => { minNameLength = name.length > minNameLength ? name.length : minNameLength })
  )

  sortedModules.forEach((typeModules:Map<string, RunnableModule>, type:string):void => {
    const items:Map<string, string> = new Map()

    typeModules.forEach((module:RunnableModule, name:string):Map<string, string> => items.set(name, composeRunnableDescription(name, module)))

    lists.push(composeUsageInformationList(items, type === 'untyped' ? undefined : type, minNameLength))
  })

  body = lists.join(EOL + EOL)

  return HEADER + EOL + EOL + body
}
