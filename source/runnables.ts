import {bold} from 'chalk'
import {ChildProcess, spawn} from 'child_process'
import {existsSync, readdirSync, statSync} from 'fs'
import {parse, resolve} from 'path'
import {parse as parseRunnableValues} from 'shell-quote'
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
              if (!(error.code && error.code === 'MODULE_NOT_FOUND'))
                throw error
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

export function resolveRunnable(key:string, runnableModules:Map<string, Map<string, RunnableModule>>):string|RunnableFactory|undefined
{
  let runnableModule:RunnableModule|undefined

  runnableModules
    .forEach((runnableModules:Map<string, RunnableModule>):void =>
    {
      if (!runnableModule && runnableModules.has(key))
        runnableModule = runnableModules.get(key)
    })

  if (runnableModule)
    return runnableModule.run

  return undefined
}

export function splitRunnableValues(values:string[]):string[][]
{
  return values
    .reduce((runnableValues:string[][], value) =>
    {
      if (runnableValues.length === 0 || value === '+')
        runnableValues.push([])

      if (value !== '+')
        runnableValues[runnableValues.length - 1].push(value)

      return runnableValues
    }, [])
}

export function resolveRequestedRunnables(values:string[], runnableModules:Map<string, Map<string, RunnableModule>>):Runnable[]
{
  const functions:Map<string, RunnableFunction> = new Map<string, RunnableFunction>()
  let allRunnableValues:string[][] = []

  splitRunnableValues(values)
    .forEach((runnableValues:string[], runnableIndex:number):void =>
    {
      const runnableKey:string = runnableValues[0]
      let runnable:string|RunnableFactory|undefined = resolveRunnable(runnableKey, runnableModules)

      if (!runnable)
        allRunnableValues.push(runnableValues)

      else
      {
        if (typeof runnable !== 'string')
          runnable = (runnable as RunnableFactory)(runnableValues.splice(1)) as string

        if (typeof runnable === 'string')
        {
          let allNestedRunnableValues:string[][] = []

          splitRunnableValues(parseRunnableValues(runnable))
            .forEach((nestedRunnableValues:string[], nestedRunnableIndex:number):void =>
            {
              const nestedRunnableKey:string = nestedRunnableValues[0]
              let nestedRunnable:string|RunnableFactory|undefined = resolveRunnable(nestedRunnableKey, runnableModules)

              if (!nestedRunnable)
                allNestedRunnableValues.push(nestedRunnableValues)

              else
              {
                if (typeof nestedRunnable !== 'string')
                  nestedRunnable = (nestedRunnable as RunnableFactory)(nestedRunnableValues.splice(1)) as string

                if (typeof nestedRunnable === 'string')
                  allNestedRunnableValues = allNestedRunnableValues.concat(splitRunnableValues(parseRunnableValues(nestedRunnable)))

                else
                {
                  allNestedRunnableValues.push(nestedRunnableValues)
                  functions.set(nestedRunnableKey, nestedRunnable)
                }
              }
            })

          allRunnableValues = allRunnableValues.concat(allNestedRunnableValues)
        }

        else
        {
          allRunnableValues.push(runnableValues)
          functions.set(runnableKey, runnable)
        }
      }
    })

  const projectBinDirectoryPath:string = resolve(process.cwd(), 'node_modules/.bin')

  if (existsSync(projectBinDirectoryPath))
    process.env.PATH = `${process.env.PATH}:${projectBinDirectoryPath}`

  const unresolvedCommands:Set<string> = new Set<string>()
  const runnables:Runnable[] = allRunnableValues.map((runnableValues:string[]):Runnable =>
  {
    const key:string = runnableValues[0]
    const args:string[] = runnableValues.splice(1)
    const definition:Runnable = {}

    if (functions.has(key))
      definition.function = functions.get(key)

    else
    {
      if (key !== 'cd' && !which(key))
        unresolvedCommands.add(key)

      definition.command = key
    }

    if (Object.keys(args).length > 0)
      definition.args = args

    return definition
  })

  if (unresolvedCommands.size > 0)
    throw new Error(`Command(s) ${[...unresolvedCommands].sort().join(' ')} could not be resolved`)

  return runnables
}

export function runFunctionRunnable(definition:Runnable):Promise<void>
{
  const returnValue:Promise<void>|void = definition.function!(definition.args)

  return returnValue instanceof Promise ? returnValue : Promise.resolve()
}

export function runDirectoryChangeRunnable({args}:Runnable):Promise<void>
{
  if (args && args.length > 0)
    process.chdir(resolve(process.cwd(), args[0]))

  return Promise.resolve()
}

export function runProcessRunnable({command, args}:Runnable):Promise<void>
{
  return new Promise<void>((resolve:() => void, reject:(message:string) => void):void =>
  {
    const childProcess:ChildProcess = spawn(command!, args || [], {env:process.env, stdio:'inherit'})
    let errors:string = ''

    childProcess.on('error', (data:Buffer):string => errors += data.toString())

    childProcess.on('close', (code:number):void =>
    {
      if (errors)
        return reject(errors.trim())

      if (code !== 0)
        return reject(`Runnable ${bold([command].concat(args || []).join(' '))} exited with code ${bold(String(code))}`)

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
