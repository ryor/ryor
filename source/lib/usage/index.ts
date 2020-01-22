import { resolveRunnableModule } from '../modules'
import { composeBinUsageInformation } from './bin'
import { composeUsageInformationList } from './lists'
import { composeMainUsageInformation } from './main'
import { composeRunnableUsageInformation } from './runnable'

export { composeUsageInformationList }

export function composeUsageInformation (value?:string, configuration?:ConfigurationUsage):string {
  if (value !== undefined) {
    if (value === 'bin') { return composeBinUsageInformation() } else {
      const runnableModule:RunnableModule|undefined = resolveRunnableModule(value)

      if (runnableModule !== undefined && runnableModule.usage !== undefined) { return composeRunnableUsageInformation(value) }
    }
  }

  return composeMainUsageInformation(configuration)
}
