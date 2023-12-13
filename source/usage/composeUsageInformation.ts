import { RunnableModule, resolveRunnableModule } from '../modules'
import { RunnerConfiguration } from '../runner'
import { composeMainUsageInformation } from './composeMainUsageInformation'
import { composeRunnableModuleUsageInformation } from './composeRunnableModuleUsageInformation'

export async function composeUsageInformation(configuration: RunnerConfiguration, runnableName?: string) {
  let usageInformation: string | undefined

  if (runnableName !== undefined) {
    const module: RunnableModule | undefined = await resolveRunnableModule(runnableName, configuration)

    if (module !== undefined) usageInformation = await composeRunnableModuleUsageInformation(runnableName, configuration)
  }

  if (usageInformation === undefined) usageInformation = await composeMainUsageInformation(configuration)

  return usageInformation
}
