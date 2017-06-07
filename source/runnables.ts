import {existsSync, readdirSync, statSync} from 'fs'
import {parse, resolve} from 'path'

export function getRunnables(type:string):Map<string, Runnable>
{
  const runnables:Map<string, Runnable> = new Map<string, Runnable>()
  const directoryPath:string = resolve(process.cwd(), 'run', type)

  if (existsSync(directoryPath) && statSync(directoryPath).isDirectory())
  {
    const runnablePaths:string[] = readdirSync(directoryPath)

    if (runnablePaths.length > 0)
      runnablePaths.forEach((runnablePath:string):void =>
      {
        try
        {
          const runnable:Runnable = require(resolve(directoryPath, runnablePath))

          if (Object.keys(runnable).length > 0)
            runnables.set(parse(runnablePath).name, runnable)
        }

        catch (error) {}
      })
  }

  return runnables
}

export function resolveRunnable(value:string):Runnable|undefined
{
  const key:string = value.split('.')[0]
  let runnable:Runnable|undefined

  ['tasks', 'tools'].forEach((type:string):void =>
  {
    if (!runnable)
    {
      const runnables:Map<string, Runnable> = getRunnables(type)

      if (runnables.has(key))
        runnable = runnables.get(key)
    }
  })

  return runnable
}
