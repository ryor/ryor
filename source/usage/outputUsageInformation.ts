import { getConsoleColumnCount, truncateConsoleOutput } from '../console'
import { RunnerConfiguration } from '../runner'
import { LINE_BREAK } from '../shared'
import { composeUsageInformation } from './composeUsageInformation'

export async function outputUsageInformation(configuration: RunnerConfiguration, runnableName?: string) {
  console.log(`${LINE_BREAK}${truncateConsoleOutput(await composeUsageInformation(configuration, runnableName), getConsoleColumnCount())}${LINE_BREAK}`)
}
