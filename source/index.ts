import { run } from './run'
import type { UsageConfiguration } from './types'

module.exports = async (usage: UsageConfiguration): Promise<void> => await run(process.argv, usage)
