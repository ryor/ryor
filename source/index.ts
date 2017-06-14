import {red} from 'chalk'
import {EOL} from 'os'
import {getRunnableModules, resolveRequestedRunnables, runRequestedRunnables} from './runnables'
import {composeUsageInformation} from './usage'

export function run(args:string[] = []):void
{
  const runnableModules:Map<string, Map<string, RunnableModule>> = getRunnableModules()

  if (runnableModules.size === 0)
    console.log(`${EOL}Add tasks and/or tools to proceed${EOL}`)

  else if (args.length === 0 || args[0] === 'tools')
    console.log(`${EOL}${composeUsageInformation(args, runnableModules)}${EOL}`)

  else
    try
    {
      const runnables:Runnable[] = resolveRequestedRunnables(args, runnableModules)

      Promise.resolve()
        .then(() => console.log(''))
        .then(() => runRequestedRunnables(runnables))
        .then(() => console.log(''))
        .catch(() => console.log(''))
    }

    catch (error)
    {
      console.log(`${EOL}${red(error.message || error)}${EOL}`)
    }
}
