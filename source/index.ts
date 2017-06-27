import {existsSync} from 'fs'
import {EOL} from 'os'
import {resolve} from 'path'
import {Runner} from './Runner'
import {handleError} from './utils/errors'
import {parseCommandLineInput} from './utils/input'
import {composeUsageInformation} from './utils/usage'

export function run(input:string[] = []):void
{
  const binDirectoryPath:string = resolve(process.cwd(), 'node_modules/.bin')
  const env:{[key:string]:string} = process.env as {[key:string]:string}

  if (existsSync(binDirectoryPath) && !env.PATH.includes(binDirectoryPath))
    env.PATH = `${env.PATH}${process.platform === 'win32' ? ';' : ':'}${binDirectoryPath}`

  try
  {
    if (input.length > 0)
      new Runner(parseCommandLineInput(input)).run().catch(handleError)

    else
      console.log(`${EOL}${composeUsageInformation()}${EOL}`)
  }

  catch (error)
  {
    handleError(error as Error)
  }
}
