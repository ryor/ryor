import { EOL } from 'os'
import { configure } from './configure'
import { ensureCorrectPathValue } from './ensureCorrectPathValue'
import { outputUsageInformation } from './outputUsageInformation'
import { runRunnableSequence } from './runRunnableSequence'
import type { Configuration, UsageConfiguration } from './types'

const DURATION_TEMPLATE: string = 'Completed in [DURATION]ms.'

export async function run (argv: string[], usage?: UsageConfiguration): Promise<void> {
  try {
    const configuration: Configuration = await configure(argv, usage)
    const { entry: { directoryPath, sequence }, outputRunDuration } = configuration
    const startTime: number | undefined = outputRunDuration ? Date.now() : undefined

    if (sequence[0] === 'help') {
      await outputUsageInformation(sequence.length > 1 ? sequence[1] : undefined, configuration)
    } else {
      ensureCorrectPathValue()
      await runRunnableSequence(sequence, undefined, directoryPath)
    }

    if (outputRunDuration) console.log(DURATION_TEMPLATE.replace('[DURATION]', String(Date.now() - startTime!)))

    process.exit(0)
  } catch (error) {
    if (error instanceof SyntaxError) console.error(`${EOL}${error.stack}${EOL}`)

    else if (error instanceof Error) console.error(`${EOL}${error.message}${EOL}`)

    else console.error(`${EOL}${error}${EOL}`)

    process.exit(1)
  }
}
