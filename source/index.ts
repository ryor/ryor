import {red} from 'chalk'
import {existsSync} from 'fs'
import {EOL} from 'os'
import {resolve} from 'path'
import {runNPSScripts} from './utils/nps'
import {Message} from './utils/strings'
import {outputUsageInformation} from './utils/usage'

export function run(args:string[] = process.argv.slice(2)):void
{
  const runDirectoryPath:string = resolve(process.cwd(), 'run')

  if (!existsSync(runDirectoryPath)
  || (!existsSync(resolve(runDirectoryPath, 'tasks')) && !existsSync(resolve(runDirectoryPath, 'tools'))))
  {
    console.log(`${EOL}${Message.Run.RunnablesRequired}${EOL}`)

    process.exit()
  }

  if (args.length === 0)
    return outputUsageInformation()

  if (args[0] === 'tools')
    return outputUsageInformation(existsSync(resolve(runDirectoryPath, 'tools')) ? 'tools' : 'tasks')

  try
  {
    runNPSScripts(args)
  }

  catch(error)
  {
    console.log(`${EOL}${red(error.message || error)}${EOL}`)

    process.exit(1)
  }
}
