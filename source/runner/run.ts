import { RUN_TIME_TEMPLATE, RunnerConfiguration, RunnerOptions, ensureCorrectPATHValue, parseRunnableModulesList } from '.'
import { parseConsoleInput } from '../console'
import { RunnableModuleError } from '../modules'
import { RunnableSequence, runRunnableSequence } from '../runnables'
import { LINE_BREAK, killChildProcesses, resolveDirectoryPath } from '../shared'
import { outputUsageInformation } from '../usage'
import { EntryRunnableModulesList } from './types'

export async function run(argv: string[], list: EntryRunnableModulesList = []) {
  let killChildProcessesOnExit = false
  let exitCode = 0

  try {
    const startTime = Date.now()
    const directory = await resolveDirectoryPath(argv[0])
    const { options, sequence }: { options: RunnerOptions; sequence: RunnableSequence } = parseConsoleInput(argv.slice(1))
    const configuration: RunnerConfiguration = { directory, modules: parseRunnableModulesList(list), options }

    await ensureCorrectPATHValue()

    if (options?.help === true || sequence.length === 0) await outputUsageInformation(configuration)
    else {
      killChildProcessesOnExit = true
      await runRunnableSequence(sequence, configuration)

      if (options?.time === true) console.log(RUN_TIME_TEMPLATE.replace('[RUN_TIME]', String(Date.now() - startTime)))
    }
  } catch (error) {
    if (error.message) console.error(`${LINE_BREAK}${error instanceof RunnableModuleError ? error.stack : error.toString()}${LINE_BREAK}`)
    exitCode = 1
  }

  if (killChildProcessesOnExit) await killChildProcesses()
  process.exit(exitCode)
}

process.on('SIGINT', () => {
  killChildProcesses().then(() => {
    process.exit(1)
  })
})
