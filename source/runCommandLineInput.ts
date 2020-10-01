import { EOL } from 'os'
import { ensureCorrectPathValue } from './ensureCorrectPathValue'
import { outputUsageInformation } from './outputUsageInformation'
import { runRunnableSequence } from './runRunnableSequence'
import { parseCommandLineInput } from './parseCommandLineInput'
import type { Configuration } from './types'

const DURATION_TEMPLATE:string = 'Completed in [DURATION]ms.'

const SHORT_DURATION_FLAG:string = '-d'

const LONG_DURATION_FLAG:string = '--duration'

export async function runCommandLineInput (args:string[] = [], configuration:Configuration = {}):Promise<void> {
  let outputDuration:boolean = false
  let startTime:number|undefined

  if (args.length > 0) {
    if (typeof args[0] === 'string' && [SHORT_DURATION_FLAG, LONG_DURATION_FLAG].includes(args[0])) {
      args.shift()
      outputDuration = true
      startTime = Date.now()
    }
  }

  try {
    if (args.length === 0 || args[0] === 'help') {
      await outputUsageInformation(args.length > 1 ? args[1] : undefined, configuration.usage)
    } else {
      ensureCorrectPathValue()
      await runRunnableSequence(parseCommandLineInput(args))
    }

    if (outputDuration) console.log(DURATION_TEMPLATE.replace('[DURATION]', String(Date.now() - startTime!)))

    process.exit(0)
  } catch (error) {
    if (error instanceof SyntaxError) console.error(`${EOL}${error.stack}${EOL}`)

    else if (error instanceof Error) console.error(`${EOL}${error.message}${EOL}`)

    else console.error(`${EOL}${error}${EOL}`)

    process.exit(1)
  }
}
