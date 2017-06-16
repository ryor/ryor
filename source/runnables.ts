import {bold} from 'chalk'
import {ChildProcess, spawn} from 'child_process'
import {existsSync, readdirSync, statSync} from 'fs'
import {parse, resolve} from 'path'
import {parse as parseRunString} from 'shell-quote'
import {which} from 'shelljs'

export function getRunnableModules():Map<string, Map<string, RunnableModule>>
{
  const runnablesDirectoryPath:string = resolve(process.cwd(), 'run')
  const runnableModules:Map<string, Map<string, RunnableModule>> = ['tasks', 'tools']
    .reduce((map:Map<string, Map<string, RunnableModule>>, type:string):Map<string, Map<string, RunnableModule>> =>
    {
      const directoryPath:string = resolve(runnablesDirectoryPath, type)

      if (existsSync(directoryPath) && statSync(directoryPath).isDirectory())
      {
        const modules:Map<string, RunnableModule> = new Map<string, RunnableModule>()

        readdirSync(directoryPath)
          .filter((modulePath:string):boolean => modulePath.endsWith('.js') || existsSync(resolve(directoryPath, modulePath, 'index.js')))
          .map((modulePath:string):string => parse(modulePath).name)
          .forEach((key:string):void =>
          {
            let runnableModule:RunnableModule|undefined

            try
            {
              runnableModule = require(`${directoryPath}/${key}`)
            }

            catch (error)
            {
              throw new Error(error.stack.toString())
            }

            if (runnableModule && runnableModule.run)
              modules.set(key, runnableModule)
          })

        if (modules.size > 0)
          map.set(type, modules)
      }

      return map

    }, new Map<string, Map<string, RunnableModule>>())

  return runnableModules
}

export function resolveRunnables(values:string[], runnableModules:Map<string, Map<string, RunnableModule>>):Runnable[]
{
  return values
    .reduce((runnablesValues:string[][], value):string[][] =>
    {
      if (runnablesValues.length === 0 || value === '+')
        runnablesValues.push([])

      if (value !== '+')
        runnablesValues[runnablesValues.length - 1].push(value)

      return runnablesValues
    }, [])
    .reduce((result:Runnable[], runnableValues:string[]):Runnable[] =>
    {
      let command:string = runnableValues[0]
      let args:string[] = runnableValues.slice(1)
      let run:string|RunnableFactory|RunnableFunction|undefined

      runnableModules
        .forEach((typeModules:Map<string, RunnableModule>):void =>
        {
          if (!run && typeModules.has(command))
            run = typeModules.get(command)!.run
        })

      if (run)
      {
        if (typeof run === 'function')
          run = run(runnableValues.slice(1)) as string|RunnableFunction

        if (typeof run === 'function')
          return result.concat([{function: run, args: runnableValues.slice(1)}])

        else if (typeof run === 'string')
        {
          const parsedRunString:string[] = parseRunString(run)

          if (parsedRunString.includes('+') || parsedRunString[0] !== command)
            return result.concat(resolveRunnables(parsedRunString, runnableModules))

          else
          {
            command = parsedRunString[0]
            args = parsedRunString.slice(1)
          }
        }

        else
          throw new Error(`Error occurred while resolving ${bold(command)} module. Expected run value to be either a string or a function. Received ${bold(typeof run)}.`)
      }

      if (command !== 'cd' && !which(command))
        throw new Error(`Command ${bold(command)} could not be resolved`)

      if (!(command === 'cd' && args.length === 0))
        return result.concat([{command, args}])

      return result
    }, [])
}

export function runFunctionRunnable(definition:Runnable):Promise<void>
{
  const returnValue:Promise<void>|void = definition.function!(definition.args)

  return returnValue instanceof Promise ? returnValue : Promise.resolve()
}

export function runDirectoryChangeRunnable({args}:Runnable):Promise<void>
{
  if (args.length > 0)
    process.chdir(resolve(process.cwd(), args[0]))

  return Promise.resolve()
}

export function runProcessRunnable({command, args}:Runnable):Promise<void>
{
  return new Promise<void>((resolve:() => void, reject:(message:string) => void):void =>
  {
    const childProcess:ChildProcess = spawn(command!, args, {env:process.env, stdio:'inherit'})
    let errors:string = ''

    childProcess.on('error', (data:Buffer):string => errors += data.toString())

    childProcess.on('close', (code:number):void =>
    {
      if (errors)
        return reject(errors.trim())

      if (code !== 0)
        return reject('')

      else
        resolve()
    })
  })
}

export function runRequestedRunnables(definitions:Runnable[]):Promise<void>
{
  return definitions
    .reduce((previousPromise:Promise<void>, definition:Runnable):Promise<void> =>
      previousPromise
        .then(():Promise<void> =>
        {
          if (definition.function)
            return runFunctionRunnable(definition)

          if (definition.command === 'cd')
            return runDirectoryChangeRunnable(definition)

          return runProcessRunnable(definition)
        }),
      Promise.resolve()
    )
}
