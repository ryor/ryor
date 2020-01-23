import cliTruncate from 'cli-truncate'
import minimist from 'minimist'
import { EOL } from 'os'
import { Runner } from '../classes/Runner'
import { handleError } from './errors'
import { parseCommandLineInput } from './input'
import { ensureCorrectPathValue } from './path'
import { composeUsageInformation } from './usage'

export const RUN_DURATION_MESSAGE:string = 'Completed in [TIME]ms.'

export const DEFAULT_TRUNCATION_COLUMNS:number = 100

export function run (input:string[] = [], configuration:Configuration = {}):void {
  const flags:string[] = []
  let outputRunDuration:boolean = false
  let startTime:number|undefined

  if (input.length > 0) {
    while (input[0].charAt(0) === '-') flags.push(input.shift()!)
  }

  if (flags.length > 0) {
    const parsedFlags:minimist.ParsedArgs = minimist(flags, {
      alias: { c: 'command', t: 'time' },
      boolean: ['c', 'command', 't', 'time']
    })

    if (parsedFlags.command === true) input.unshift('-c')

    if (parsedFlags.time === true) {
      outputRunDuration = true
      startTime = Date.now()
    }
  }

  try {
    if (input.length === 0 || input[0] === 'help') {
      console.log(`${EOL}${
        composeUsageInformation(input.length > 1 ? input[1] : undefined, configuration.usage)
          .split(EOL)
          .map((line) => cliTruncate(line, <number>process.stdout.columns || DEFAULT_TRUNCATION_COLUMNS))
          .join(EOL)
        }${EOL}`)

      if (outputRunDuration) console.log(RUN_DURATION_MESSAGE.replace('[TIME]', String(Date.now() - startTime!)))
    } else {
      ensureCorrectPathValue()

      new Runner(parseCommandLineInput(input))
        .run()
        .then(():void => {
          if (outputRunDuration) console.log(RUN_DURATION_MESSAGE.replace('[TIME]', String(Date.now() - startTime!)))
        })
        .catch(handleError)
    }
  } catch (error) {
    handleError(<Error>error)
  }
}
