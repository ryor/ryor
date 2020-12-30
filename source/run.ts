import { configure } from './configure'
import { ensureCorrectPathValue } from './ensureCorrectPathValue'
import { outputUsageInformation } from './outputUsageInformation'
import { RunnableError } from './RunnableError'
import { runRunnableSequence } from './runRunnableSequence'
import type { Configuration, UsageConfiguration } from './types'

const DURATION_TEMPLATE: string = 'Completed in [DURATION]ms.'

export async function run (argv: string[], usage?: UsageConfiguration): Promise<void> {
  try {
    const configuration: Configuration = await configure(argv, usage)
    const { entry: { directoryPath, sequence }, outputRunDuration } = configuration
    const startTime: number = Date.now()

    if (sequence[0] === 'help') {
      await outputUsageInformation(sequence.length > 1 ? sequence[1] : undefined, configuration)
    } else {
      ensureCorrectPathValue()
      await runRunnableSequence(sequence, directoryPath, undefined)
    }

    if (outputRunDuration === true) console.log(DURATION_TEMPLATE.replace('[DURATION]', String(Date.now() - startTime)))

    process.exit(0)
  } catch (error) {
    if (error instanceof RunnableError) console.error(error.message)
    else console.error(error)

    process.exit(1)
  }
}
