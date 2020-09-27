import cliTruncate from 'cli-truncate'
import { EOL } from 'os'
import { composeMainUsageInformation } from './composeMainUsageInformation'
import { composeRunnableUsageInformation } from './composeRunnableUsageInformation'
import { getOutputColumnCount } from './getOutputColumnCount'
import { resolveRunnableModule } from './resolveRunnableModule'
import type { RunnableModule, UsageConfiguration } from './types'

export async function outputUsageInformation (runnableName?:string, configuration?:UsageConfiguration):Promise<void> {
  let usageInformation:string|undefined

  if (runnableName) {
    const module:RunnableModule|undefined = await resolveRunnableModule(runnableName)

    if (module) usageInformation = await composeRunnableUsageInformation(runnableName)
  }

  if (!usageInformation) usageInformation = await composeMainUsageInformation(configuration)

  console.log(`${EOL}${usageInformation.split(EOL).map((line:string):string => cliTruncate(line, getOutputColumnCount())).join(EOL)}${EOL}`)
}
