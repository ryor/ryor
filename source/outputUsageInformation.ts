import cliTruncate from 'cli-truncate'
import { EOL } from 'os'
import { composeMainUsageInformation } from './composeMainUsageInformation'
import { composeRunnableUsageInformation } from './composeRunnableUsageInformation'
import { getOutputColumnCount } from './getOutputColumnCount'
import { resolveRunnableModule } from './resolveRunnableModule'
import type { Configuration, RunnableModule } from './types'

export async function outputUsageInformation (runnableName: string | undefined, configuration: Configuration): Promise<void> {
  let usageInformation: string | undefined

  if (runnableName) {
    const module: RunnableModule | undefined = await resolveRunnableModule(runnableName, configuration.entry.directoryPath)

    if (module) usageInformation = await composeRunnableUsageInformation(runnableName, configuration)
  }

  if (!usageInformation) usageInformation = await composeMainUsageInformation(configuration)

  console.log(`${EOL}${usageInformation.split(EOL).map((line: string): string => cliTruncate(line, getOutputColumnCount())).join(EOL)}${EOL}`)
}
