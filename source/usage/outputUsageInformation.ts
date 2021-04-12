import { getConsoleColumnCount, truncateConsoleOutput } from '../console'
import { LINE_BREAK } from '../shared'
import { composeUsageInformation } from './composeUsageInformation'
import type { RunnerConfiguration } from '../runner'

export async function outputUsageInformation (configuration: RunnerConfiguration, runnableName?: string): Promise<void> {
  console.log(`${LINE_BREAK}${truncateConsoleOutput(await composeUsageInformation(configuration, runnableName), getConsoleColumnCount())}${LINE_BREAK}`)
}
