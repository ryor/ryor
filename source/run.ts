import { promisify } from 'util'
import { parseConsoleInput } from './console'
import { runRunnableSequence } from './runnables'
import { RUN_TIME_TEMPLATE, ensureCorrectPATHValue } from './runner'
import { resolveDirectoryPath, terminateChildProcesses } from './shared'
import { outputUsageInformation } from './usage'
import type { RunnableSequence } from './runnables'
import type { RunnerConfiguration, RunnerOptions } from './runner'
import type { UsageConfiguration } from './usage'

export async function run (argv: string[], usage?: UsageConfiguration): Promise<void> {
  let exitCode = 0

  try {
    const startTime: number = Date.now()
    const directory: string = await resolveDirectoryPath(argv[0])
    const { options, sequence }: { options: RunnerOptions, sequence: RunnableSequence } = parseConsoleInput(argv.slice(1))
    const configuration: RunnerConfiguration = { directory, options, usage }

    await ensureCorrectPATHValue()

    if (options?.help === true || sequence.length === 0) await outputUsageInformation(configuration)

    else {
      await runRunnableSequence(sequence, { directory, options, usage })

      if (options?.time === true) console.log(RUN_TIME_TEMPLATE.replace('[RUN_TIME]', String(Date.now() - startTime)))
    }
  } catch (error) {
    console.error(error)
    exitCode = 1
  }

  await terminateChildProcesses()
  process.exit(exitCode)
}

process.on('SIGINT', (): void => {
  terminateChildProcesses().then((): void => {
    process.exit(1)
  })
})
