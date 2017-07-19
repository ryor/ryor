import * as minimist from 'minimist'
import {EOL} from 'os'
import {Runner} from '../classes/Runner'
import {handleError} from './errors'
import {parseCommandLineInput} from './input'
import {ensureCorrectPathValue} from './path'
import {composeUsageInformation} from './usage'

export const RUN_DURATION_MESSAGE:string = 'Completed in [TIME]ms.'

export function run(input:string[] = [], configuration:Configuration = {}):void
{
  const flags:string[] = []
  let outputRunDuration:boolean = false
  let startTime:number|undefined

  if (input.length > 0)
    while (input[0].charAt(0) === '-')
      flags.push(input.shift()!)

  if (flags.length > 0)
  {
    const minimistFunction:(args:string[], opts:minimist.Opts) => minimist.ParsedArgs = minimist
    const parsedFlags:minimist.ParsedArgs = minimistFunction(flags, {
      alias: {c: 'command', t: 'time'},
      boolean: ['c', 'command', 't', 'time']
    })

    if (parsedFlags.command === true)
      input.unshift('-c')

    if (parsedFlags.time === true)
    {
      outputRunDuration = true
      startTime = Date.now()
    }
  }

  try
  {
    if (input.length === 0 || input[0] === 'help')
    {
      console.log(`${EOL}${composeUsageInformation(input.length > 1 ? input[1] : undefined, configuration.usage)}${EOL}`)

      if (outputRunDuration)
        console.log(RUN_DURATION_MESSAGE.replace('[TIME]', String(Date.now() - startTime!)))
    }

    else
    {
      ensureCorrectPathValue()

      new Runner(parseCommandLineInput(input))
        .run()
        .then(():void =>
        {
          if (outputRunDuration)
            console.log(RUN_DURATION_MESSAGE.replace('[TIME]', String(Date.now() - startTime!)))
        })
        .catch(handleError)
    }
  }

  catch (error)
  {
    handleError(error as Error)
  }
}
