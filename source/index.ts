import {red} from 'chalk'
import {existsSync} from 'fs'
import {EOL} from 'os'
import {resolve} from 'path'
import {getRunnableModules, resolveRunnables, runRunnablesSeries} from './runnables'
import {composeUsageInformation} from './usage'

export function run(args:string[] = []):void
{
  try
  {
    const runnableModules:Map<string, Map<string, RunnableModule>> = getRunnableModules()

    if (runnableModules.size === 0)
      throw new Error('Could not resolve any tasks or tools')

    else if (args.length === 0 || args[0] === 'tools')
      console.log(`${EOL}${composeUsageInformation(args, runnableModules)}${EOL}`)

    else
    {
      const projectBinDirectoryPath:string = resolve(process.cwd(), 'node_modules/.bin')

      if (existsSync(projectBinDirectoryPath))
          process.env.PATH = `${process.env.PATH}${process.platform === 'win32' ? ';' : ':'}${projectBinDirectoryPath}`

      const runnables:(Runnable|Runnable[])[] = resolveRunnables(args, runnableModules)

      runRunnablesSeries(runnables)
        .catch((error) =>
        {
          if (error)
            console.error(`${EOL}${red(error.stack || error)}${EOL}`)

          process.exit(1)
        })
    }
  }

  catch (error)
  {
    console.error(`${EOL}${red(error.message || error)}${EOL}`)

    process.exit(1)
  }
}
