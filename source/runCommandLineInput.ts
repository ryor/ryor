import minimist from 'minimist'
import { EOL } from 'os'
import { ensureCorrectPathValue } from './ensureCorrectPathValue'
import { outputUsageInformation } from './outputUsageInformation'
import { runRunnableSequence } from './runRunnableSequence'
import { parseCommandLineInput } from './parseCommandLineInput'
import type { Configuration } from './types'

const RUN_DURATION_TEMPLATE:string = 'Completed in [TIME]ms.'

export async function runCommandLineInput (args:string[] = [], configuration:Configuration = {}):Promise<void> {
  const options:string[] = []
  let outputTime:boolean = false
  let startTime:number|undefined

  if (args.length > 0) {
    while (args[0].charAt(0) === '-') options.push(args.shift()!)
  }

  if (options.length > 0) {
    const { time }:minimist.ParsedArgs = minimist(options, {
      alias: { t: 'time' },
      boolean: ['t', 'time']
    })

    if (time === true) {
      outputTime = true
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

    if (outputTime) console.log(RUN_DURATION_TEMPLATE.replace('[TIME]', String(Date.now() - startTime!)))

    process.exit(0)
  } catch (error) {
    if (error instanceof SyntaxError) console.error(`${EOL}${error.stack}${EOL}`)

    else if (error instanceof Error) console.error(`${EOL}${error.message}${EOL}`)

    else console.error(`${EOL}${error}${EOL}`)

    process.exit(1)
  }
}
