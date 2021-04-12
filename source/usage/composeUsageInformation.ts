import { RunnableModule, resolveRunnableModule } from '../modules'
import { composeMainUsageInformation } from './composeMainUsageInformation'
import { composeRunnableUsageInformation } from './composeRunnableUsageInformation'
import type { RunnerConfiguration } from '../runner'

export async function composeUsageInformation (configuration: RunnerConfiguration, runnableName?: string): Promise<string> {
  let usageInformation: string | undefined

  if (runnableName !== undefined) {
    const module: RunnableModule | undefined = await resolveRunnableModule(runnableName, configuration)

    if (module !== undefined) usageInformation = await composeRunnableUsageInformation(runnableName, configuration)
  }

  if (usageInformation === undefined) usageInformation = await composeMainUsageInformation(configuration)

  return usageInformation
}
