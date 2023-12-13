import { resolve } from 'path'
import { RunnerConfiguration } from '../runner'
import { importModule } from './importModule'
import { isValidRunnableModule } from './isValidRunnableModule'
import { resolveModulePath } from './resolveModulePath'
import { RunnableModule } from './types'

export async function resolveRunnableModule(name: string, { directory, modules, options }: RunnerConfiguration) {
  const runnableModulesListItem = modules.find(([moduleName]) => moduleName === name)

  if (runnableModulesListItem) {
    const [, category] = runnableModulesListItem
    const modulePath = await resolveModulePath(category ? resolve(directory, category) : directory, name)

    if (modulePath) {
      const module = await importModule(modulePath, options?.debug)

      if (module && isValidRunnableModule(module)) return module as RunnableModule
    }
  }

  return undefined
}
