import * as minimist from 'minimist'
import {EOL} from 'os'
import {CommandRunnable} from './classes/CommandRunnable'
import {FunctionRunnable} from './classes/FunctionRunnable'
import {Runner} from './classes/Runner'
import {handleError} from './utils/errors'
import {parseCommandLineInput} from './utils/input'
import {ensureCorrectPathValue} from './utils/path'
import {composeUsageInformation, composeUsageInformationList} from './utils/usage'

export const RUN_DURATION_MESSAGE:string = 'Completed in [TIME]ms.'

export function run(input:string[] = []):void
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
      alias: {b: 'bin', t: 'time'},
      boolean: ['b', 'bin', 't', 'time']
    })

    if (parsedFlags.bin === true)
      input.unshift('-b')

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
      console.log(`${EOL}${composeUsageInformation(input.length > 1 ? input[1] : undefined)}${EOL}`)

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

export {CommandRunnable, FunctionRunnable, Runner, composeUsageInformationList}
