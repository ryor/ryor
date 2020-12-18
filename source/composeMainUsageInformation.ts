import { bold } from 'chalk'
import { EOL } from 'os'
import { composeRunnableDescription } from './composeRunnableDescription'
import { composeUsageInformationList } from './composeUsageInformationList'
import { resolveAllRunnableModules } from './resolveAllRunnableModules'
import type { Configuration, RunnableModule } from './types'

export const HEADER: string = `${bold('Usage:')} node [ENTRY_DIRECTORY_NAME] [option] <runnable> [args...] [+ <runnable> [args...]] ...`

export const FOOTER: string = `Use ${bold('node [ENTRY_DIRECTORY_NAME] help <runnable>')} for detailed usage information about any runnables above that provide it.`

export const NO_RUNNABLES_RESOLVED_MESSAGE: string = 'No runnables found.'

export async function composeMainUsageInformation (configuration: Configuration): Promise<string> {
  const { entry }: Configuration = configuration
  const allModules: Map<string, Map<string, RunnableModule>> = await resolveAllRunnableModules(entry.directoryPath)

  if (allModules.size === 0) return NO_RUNNABLES_RESOLVED_MESSAGE

  const EOL2: string = EOL + EOL
  const sortedModules: Map<string, Map<string, RunnableModule>> = new Map()
  const untypedModules = allModules.get('untyped')
  const lists: string[] = []
  let minNameLength: number = 0
  let body: string = ''

  if (untypedModules) allModules.delete('untyped')

  if (configuration.usage && configuration.usage.types) {
    configuration.usage.types.forEach((type: string): void => {
      if (allModules.has(type)) {
        sortedModules.set(type, allModules.get(type)!)
        allModules.delete(type)
      }
    })
  }

  allModules.forEach((map: Map<string, RunnableModule>, type: string): Map<string, Map<string, RunnableModule>> => sortedModules.set(type, map))

  if (untypedModules) sortedModules.set(sortedModules.size > 0 ? 'other' : 'untyped', untypedModules)

  sortedModules.forEach((typeModules: Map<string, RunnableModule>): void =>
    typeModules.forEach((_, name: string): void => { minNameLength = name.length > minNameLength ? name.length : minNameLength })
  )

  sortedModules.forEach((typeModules: Map<string, RunnableModule>, type: string): void => {
    const items: Map<string, string> = new Map()

    typeModules.forEach((module: RunnableModule, name: string): Map<string, string> => items.set(name, composeRunnableDescription(name, module, configuration, true)))

    lists.push(composeUsageInformationList(items, type === 'untyped' ? undefined : type, minNameLength))
  })

  body = lists.join(EOL2)

  return HEADER.replace('[ENTRY_DIRECTORY_NAME]', entry.directoryName) +
    EOL2 +
    body +
    EOL2 +
    FOOTER.replace('[ENTRY_DIRECTORY_NAME]', entry.directoryName)
}
