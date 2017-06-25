import {red} from 'chalk'
import {existsSync} from 'fs'
import {EOL} from 'os'
import {resolve} from 'path'
import Runner from './Runner'
import {parseCommandLineInput} from './input'
import {composeUsageInformation} from './usage'

export function run(input:string[] = []):void
{
  const binDirectoryPath = resolve(process.cwd(), 'node_modules/.bin')

  if (existsSync(binDirectoryPath) && !process.env.PATH.includes(binDirectoryPath))
    process.env.PATH = `${process.env.PATH}${process.platform === 'win32' ? ';' : ':'}${binDirectoryPath}`

  if (input.length > 0)
    new Runner(parseCommandLineInput(input)).next()
      .catch((error) =>
      {
        if (error)
          console.error(`${EOL}${red(error.message || error)}${EOL}`)

        process.exit(1)
      })

  else
    console.log(`${EOL}${composeUsageInformation()}${EOL}`)
}
