import { basename } from 'path'
import { resolveAllRunnableModules } from '../modules'
import { RunnerConfiguration } from '../runner'
import { LINE_BREAK } from '../shared'
import { composeRunnableDescription } from './composeRunnableDescription'
import { composeUsageInformationList } from './composeUsageInformationList'
import { MAIN_USAGE_FOOTER, MAIN_USAGE_HEADER, NO_RUNNABLES_RESOLVED_MESSAGE } from './constants'

export async function composeMainUsageInformation(configuration: RunnerConfiguration) {
  const { directory } = configuration
  const allModules = await resolveAllRunnableModules(configuration)

  if (allModules.size === 0) return NO_RUNNABLES_RESOLVED_MESSAGE

  const entryDirectoryName = basename(directory)
  const categoryModuleNames = new Map()
  const uncategorizedModuleNames: string[] = []
  const lists: string[] = []
  let minNameLength = 0
  let body = ''

  for (const [name, category] of configuration.modules) {
    if (allModules.has(name)) {
      if (name.length > minNameLength) minNameLength = name.length

      if (category) {
        if (!categoryModuleNames.has(category)) categoryModuleNames.set(category, [])
        categoryModuleNames.get(category).push(name)
      } else uncategorizedModuleNames.push(name)
    }
  }

  if (categoryModuleNames.size > 0) {
    for (const [category, names] of categoryModuleNames.entries()) {
      const items = new Map()

      for (const name of names) items.set(name, composeRunnableDescription(allModules.get(name)!))

      lists.push(composeUsageInformationList(items, category, minNameLength))
    }
  }

  if (uncategorizedModuleNames.length > 0) {
    const items = new Map()

    for (const name of uncategorizedModuleNames) items.set(name, composeRunnableDescription(allModules.get(name)!))

    lists.push(composeUsageInformationList(items, categoryModuleNames.size > 0 ? 'other' : undefined, minNameLength))
  }

  body = lists.join(LINE_BREAK + LINE_BREAK)

  return [
    MAIN_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', entryDirectoryName),
    body,
    MAIN_USAGE_FOOTER.replace('[ENTRY_DIRECTORY_NAME]', entryDirectoryName)
  ]
    .map((value: string) => value.trim())
    .join(LINE_BREAK + LINE_BREAK)
}
