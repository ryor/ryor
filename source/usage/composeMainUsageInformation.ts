import { basename } from 'path'
import { resolveAllRunnableModules } from '../modules'
import { LINE_BREAK } from '../shared'
import { composeRunnableDescription } from './composeRunnableDescription'
import { composeUsageInformationList } from './composeUsageInformationList'
import { MAIN_USAGE_FOOTER, MAIN_USAGE_HEADER, NO_RUNNABLES_RESOLVED_MESSAGE } from './constants'
import type { RunnableModule } from '../modules'
import type { RunnerConfiguration } from '../runner'

export async function composeMainUsageInformation (configuration: RunnerConfiguration): Promise<string> {
  const { directory, options }: RunnerConfiguration = configuration
  const allModules: Map<string, Map<string, RunnableModule>> = await resolveAllRunnableModules(directory, options?.debug === true)

  if (allModules.size === 0) return NO_RUNNABLES_RESOLVED_MESSAGE

  const entryDirectoryName: string = basename(directory)
  const sortedModules: Map<string, Map<string, RunnableModule>> = new Map()
  const untypedModules = allModules.get('untyped')
  const lists: string[] = []
  let minNameLength: number = 0
  let body: string = ''

  if (untypedModules !== undefined) allModules.delete('untyped')

  if (configuration?.usage?.categories !== undefined) {
    configuration.usage.categories.forEach((type: string): void => {
      if (allModules.has(type)) {
        sortedModules.set(type, allModules.get(type) as Map<string, RunnableModule>)
        allModules.delete(type)
      }
    })
  }

  allModules.forEach((map: Map<string, RunnableModule>, type: string): Map<string, Map<string, RunnableModule>> => sortedModules.set(type, map))

  if (untypedModules !== undefined) sortedModules.set(sortedModules.size > 0 ? 'other' : 'untyped', untypedModules)

  sortedModules.forEach((typeModules: Map<string, RunnableModule>): void =>
    typeModules.forEach((_, name: string): void => { minNameLength = name.length > minNameLength ? name.length : minNameLength })
  )

  sortedModules.forEach((typeModules: Map<string, RunnableModule>, type: string): void => {
    const items: Map<string, string | undefined> = new Map()

    typeModules.forEach((module: RunnableModule, name: string): Map<string, string | undefined> => items.set(name, composeRunnableDescription(module)))

    lists.push(composeUsageInformationList(items, type === 'untyped' ? undefined : type, minNameLength))
  })

  body = lists.join(LINE_BREAK + LINE_BREAK)

  return [
    MAIN_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', entryDirectoryName),
    body,
    MAIN_USAGE_FOOTER.replace('[ENTRY_DIRECTORY_NAME]', entryDirectoryName)
  ].map((value: string): string => value.trim()).join(LINE_BREAK + LINE_BREAK)
}
