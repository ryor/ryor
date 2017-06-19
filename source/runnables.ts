import {bold} from 'chalk'
import {ChildProcess, spawn} from 'child_process'
import {existsSync, readdirSync, statSync} from 'fs'
import {parse, resolve} from 'path'
import {parse as parseRunString} from 'shell-quote'
import {which} from 'shelljs'

export function getRunnableModules():Map<string, Map<string, RunnableModule>>
{
  const runnablesDirectoryPath:string = resolve(process.cwd(), 'run')

  return ['tasks', 'tools'].reduce((map:Map<string, Map<string, RunnableModule>>, type:string):Map<string, Map<string, RunnableModule>> =>
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
}

export function splitRunnableValues(values:string[]):string[][]
{
  if (!values.includes('+'))
    return [values]

  return values.reduce((runnablesValues:string[][], value:string):string[][] =>
  {
    if (runnablesValues.length === 0 || value === '+')
      runnablesValues.push([])

    if (value !== '+')
      runnablesValues[runnablesValues.length - 1].push(value)

    return runnablesValues
  }, [])
}

export function resolveRunnables(values:string[], runnableModules:Map<string, Map<string, RunnableModule>>):(Runnable|Runnable[])[]
{
  return splitRunnableValues(values).reduce((runnables:(Runnable|Runnable[])[], values:string[]):(Runnable|Runnable[])[] =>
  {
    let command:string = values[0]
    let args:string[] = values.slice(1)
    let run:string|string[]|RunnableFactory|RunnableFunction|undefined

    runnableModules.forEach((typeModules:Map<string, RunnableModule>):void =>
    {
      if (!run && typeModules.has(command))
        run = typeModules.get(command)!.run
    })

    if (run)
    {
      if (typeof run === 'function')
        run = run(values.slice(1)) as string|RunnableFunction

      if (typeof run === 'function')
        return runnables.concat([{function: run, args: values.slice(1)}])

      else if (typeof run === 'string')
      {
        splitRunnableValues(parseRunString(run)).forEach((values:string[]):void =>
        {
          if (values[0] === command)
            runnables.push({command:values[0], args:values.slice(1)})

          else
            runnables = runnables.concat(resolveRunnables(values, runnableModules))
        })

        return runnables
      }

      else if (Array.isArray(run))
      {
        run.forEach((values:string|string[]):void =>
        {
          if (typeof values === 'string')
          {
            const runnableValues = parseRunString(values)

            if (runnableValues[0] === command)
              runnables.push({command:runnableValues[0], args:runnableValues.slice(1)})

            else
              runnables = runnables.concat(resolveRunnables(runnableValues, runnableModules))
          }

          else if (Array.isArray(values))
          {
            let parallelRunnables:Runnable[] = []

            values.forEach((value:string):void =>
            {
              parallelRunnables = parallelRunnables.concat(resolveRunnables(parseRunString(value), runnableModules) as Runnable[])
            })

            runnables.push(parallelRunnables)
          }
        })

        return runnables
      }

      else
        throw new Error(`Error occurred while resolving ${bold(command)} module. Expected run value to be either a string, a function or an array. Received ${bold(typeof run)}.`)
    }

    if (command !== 'cd' && !which(command))
      throw new Error(`Command ${bold(command)} could not be resolved`)

    if (!(command === 'cd' && args.length === 0))
      return runnables.concat([{command, args}])

    return runnables
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

export function runRunnable(runnable:Runnable):Promise<void>
{
  if (runnable.function)
    return runFunctionRunnable(runnable)

  if (runnable.command === 'cd')
    return runDirectoryChangeRunnable(runnable)

  return runProcessRunnable(runnable)
}

export function runRunnablesParallel(runnables:Runnable[]):Promise<void>
{
  return Promise
    .all(runnables.map((runnable:Runnable):Promise<void> => runRunnable(runnable)))
    .then(():void => {})
}

export function runRunnablesSeries(steps:(Runnable|Runnable[])[]):Promise<void>
{
  return steps.reduce((previousStep:Promise<void>, nextStep:Runnable|Runnable[]):Promise<void> => previousStep.then(():Promise<void> =>
  {
    if (Array.isArray(nextStep))
      return runRunnablesParallel(nextStep)

    return runRunnable(nextStep)
  }),
  Promise.resolve())
}
