import { parseConsoleInput } from './console'
import { runRunnableSequence } from './runnables'
import { RUN_TIME_TEMPLATE, ensureCorrectPATHValue } from './runner'
import { resolveDirectoryPath } from './shared'
import type { RunnableSequence } from './runnables'
import type { RunnerOptions } from './runner'
import type { UsageConfiguration } from './usage'

export async function run (argv: string[], usage?: UsageConfiguration): Promise<void> {
  try {
    const startTime: number = Date.now()
    const directory: string = await resolveDirectoryPath(argv[0])
    const { options, sequence }: { options: RunnerOptions, sequence: RunnableSequence } = parseConsoleInput(argv.slice(1))

    ensureCorrectPATHValue()

    await runRunnableSequence(sequence, { directory, options, usage })

    if (options?.time === true) console.log(RUN_TIME_TEMPLATE.replace('[RUN_TIME]', String(Date.now() - startTime)))
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}
