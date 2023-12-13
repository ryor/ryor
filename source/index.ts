import { run } from './runner'
import { EntryRunnableModulesList } from './runner/types'

export default async (list: EntryRunnableModulesList) => await run(process.argv.slice(1), list)
