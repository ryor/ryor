import { parseConsoleInput } from './console'
import { RunnableError, runRunnableSequence } from './runnables'
import { RUN_TIME_TEMPLATE, ensureCorrectPATHValue } from './runner'
import { LINE_BREAK, resolveDirectoryPath, killChildProcesses } from './shared'
import { outputUsageInformation } from './usage'
import type { RunnableSequence } from './runnables'
import type { RunnerConfiguration, RunnerOptions } from './runner'
import type { UsageConfiguration } from './usage'

export async function run(argv: string[], usage?: UsageConfiguration): Promise<void> {
  let killChildProcessesOnExit = false
  let exitCode = 0

  try {
    const startTime: number = Date.now()
    const directory: string = await resolveDirectoryPath(argv[0])
    const { options, sequence }: { options: RunnerOptions; sequence: RunnableSequence } = parseConsoleInput(argv.slice(1))
    const configuration: RunnerConfiguration = { directory, options, usage }

    await ensureCorrectPATHValue()

    if (options?.help === true || sequence.length === 0) await outputUsageInformation(configuration)
    else {
      killChildProcessesOnExit = true
      await runRunnableSequence(sequence, { directory, options, usage })

      if (options?.time === true) console.log(RUN_TIME_TEMPLATE.replace('[RUN_TIME]', String(Date.now() - startTime)))
    }
  } catch (error) {
    if (error.message) console.error(`${LINE_BREAK}${error.toString()}${error instanceof RunnableError ? error.stack : ''}${LINE_BREAK}`)
    exitCode = 1
  }

  if (killChildProcessesOnExit) await killChildProcesses()
  process.exit(exitCode)
}

process.on('SIGINT', (): void => {
  killChildProcesses().then((): void => {
    process.exit(1)
  })
})
