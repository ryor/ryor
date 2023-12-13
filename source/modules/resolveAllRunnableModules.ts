import { resolveRunnableModule } from '.'
import { RunnerConfiguration } from '../runner'
import { RunnableModule } from './types'

export async function resolveAllRunnableModules(configuration: RunnerConfiguration) {
  const modules = new Map<string, RunnableModule>()

  if (configuration.modules.length > 0) {
    await Promise.all(
      configuration.modules.map(async ([name]) => {
        const module = await resolveRunnableModule(name, configuration)

        if (module) modules.set(name, module)
      })
    )
  }

  return modules
}
