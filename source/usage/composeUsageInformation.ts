import { RunnableModule, resolveRunnableModule } from '../modules'
import { composeMainUsageInformation } from './composeMainUsageInformation'
import { composeRunnableModuleUsageInformation } from './composeRunnableModuleUsageInformation'
import type { RunnerConfiguration } from '../runner'

export async function composeUsageInformation (configuration: RunnerConfiguration, runnableName?: string): Promise<string> {
  let usageInformation: string | undefined

  if (runnableName !== undefined) {
    const module: RunnableModule | undefined = await resolveRunnableModule(runnableName, configuration)

    if (module !== undefined) usageInformation = await composeRunnableModuleUsageInformation(runnableName, configuration)
  }

  if (usageInformation === undefined) usageInformation = await composeMainUsageInformation(configuration)

  return usageInformation
}
