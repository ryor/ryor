import {existsSync} from 'fs'
import {EOL} from 'os'
import {resolve} from 'path'
import {CommandRunnable} from './classes/CommandRunnable'
import {FunctionRunnable} from './classes/FunctionRunnable'
import {Runner} from './classes/Runner'
import {handleError} from './utils/errors'
import {parseCommandLineInput} from './utils/input'
import {composeUsageDetailsList, composeUsageInformation} from './utils/usage'

export function run(input:string[] = []):void
{
  const binDirectoryPath:string = resolve(process.cwd(), 'node_modules/.bin')
  const env:{[key:string]:string} = process.env as {[key:string]:string}
  let outputRunDuration:boolean = false
  let startTime:number|undefined

  if (existsSync(binDirectoryPath) && !env.PATH.includes(binDirectoryPath))
    env.PATH = `${env.PATH}${process.platform === 'win32' ? ';' : ':'}${binDirectoryPath}`

  try
  {
    if (input.length > 0)
    {
      if (['-t', '--time'].includes(input[0]))
      {
        outputRunDuration = true
        input = input.slice(1)
      }

      if (input[0] === 'help')
        console.log(`${EOL}${composeUsageInformation(input.length > 1 ? input[1] : undefined)}${EOL}`)

      else
      {
        if (outputRunDuration)
          startTime = Date.now()

        new Runner(parseCommandLineInput(input))
          .run()
          .then(():void =>
          {
            if (outputRunDuration)
              console.log(`Completed in ${Date.now() - startTime!}ms.`)
          })
          .catch(handleError)
      }
    }

    else
      console.log(`${EOL}${composeUsageInformation()}${EOL}`)
  }

  catch (error)
  {
    handleError(error as Error)
  }
}

export {CommandRunnable, FunctionRunnable, Runner, composeUsageDetailsList}
