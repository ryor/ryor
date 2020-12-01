import { runCommandLineInput } from './runCommandLineInput'
import type { Configuration } from './types'

module.exports = async (configuration:Configuration):Promise<void> => await runCommandLineInput(process.argv.slice(2), configuration)
