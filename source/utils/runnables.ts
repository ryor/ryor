import {existsSync, readdirSync, statSync} from 'fs'
import {parse, resolve} from 'path'

export function getRunnables(type:string):Map<string, Runnable>|undefined
{
  const directoryPath:string = resolve(process.cwd(), 'run', type)

  if (existsSync(directoryPath) && statSync(directoryPath).isDirectory())
  {
    const runnablePaths:string[] = readdirSync(directoryPath)

    if (runnablePaths.length > 0)
      return runnablePaths.reduce((runnables:Map<string, Runnable>, runnablePath:string):Map<string, Runnable> =>
      {
        const runnable:Runnable = require(resolve(directoryPath, runnablePath))

        if (Object.keys(runnable).length > 0)
          runnables.set(parse(runnablePath).name, runnable)

        return runnables
      },
      new Map<string, Runnable>())
  }

  return undefined
}

export function resolveRunnable(value:string):Runnable|undefined
{
  const key:string = value.split('.')[0]
  const tasks:Map<string, Runnable>|undefined = getRunnables('tasks')

  if (tasks && tasks.has(key))
    return tasks.get(key)

  const tools:Map<string, Runnable>|undefined = getRunnables('tools')

  if (tools && tools.has(key))
    return tools.get(key)

  return undefined
}
