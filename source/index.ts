import { run } from './run'
import type { UsageConfiguration } from './usage'

module.exports = async (usage?: UsageConfiguration): Promise<void> => await run(process.argv.slice(1), usage)
