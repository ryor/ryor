import {bold, red} from 'chalk'
import {ChildProcess, spawn} from 'child_process'
import {existsSync, readdirSync, statSync} from 'fs'
import {EOL} from 'os'
import {parse, resolve} from 'path'
import {parse as parseRunnableValues} from 'shell-quote'

export function getRunnableModules():Map<string, Map<string, RunnableModule>>
{
  const runnablesDirectoryPath:string = resolve(process.cwd(), 'run')
  const runnableResolutionErrors:string[] = []
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
              if (!error.code || error.code !== 'MODULE_NOT_FOUND')
                runnableResolutionErrors.push(`${bold(`${directoryPath.split('/').pop()}/${key}:`)} ${error.message}`)
            }

            if (runnableModule && runnableModule.run)
              modules.set(key, runnableModule)
          })

        if (modules.size > 0)
          map.set(type, modules)
      }

      return map

    }, new Map<string, Map<string, RunnableModule>>())

  if (runnableResolutionErrors.length > 0)
    console.error(red(`${EOL}The following errors were encountered while trying to resolve runnables:${EOL}${EOL}  ${red(runnableResolutionErrors.join(`${EOL}  `))}`))

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

  return allRunnableValues.map((runnableValues:string[]):Runnable =>
  {
    const key:string = runnableValues[0]
    const args:string[] = runnableValues.splice(1)
    const definition:Runnable = {}

    if (functions.has(key))
      definition.function = functions.get(key)

    else
      definition.command = key

    if (Object.keys(args).length > 0)
      definition.args = args

    return definition
  })
}

export function runFunctionRunnable(definition:Runnable):Promise<void>
{
  const returnValue:Promise<void>|void = definition.function!(definition.args)

  return returnValue instanceof Promise ? returnValue : Promise.resolve()
}

export function runProcessRunnable(definition:Runnable):Promise<void>
{
  return new Promise<void>((resolve:() => void, reject:(message:string) => void):void =>
  {
    const childProcess:ChildProcess = spawn(definition.command!, definition.args || [], {env:process.env, stdio:'inherit'})
    let errors:string = ''

    childProcess.on('error', (data:Buffer):string => errors += data.toString())

    childProcess.on('close', (code:number):void =>
    {
      if (errors)
        return reject(errors.trim())

      if (code !== 0)
        return reject(`Runnable ${bold([definition.command].concat(definition.args).join(' '))} exited with code ${bold(String(code))}`)

      else
        resolve()
    })
  })
}

export function runRequestedRunnables(definitions:Runnable[]):Promise<void>
{
  const projectBinDirectoryPath:string = resolve(process.cwd(), 'node_modules/.bin')

  if (existsSync(projectBinDirectoryPath))
    process.env.PATH = `${process.env.PATH}:${projectBinDirectoryPath}`

  return definitions
    .reduce((previousPromise:Promise<void>, definition:Runnable):Promise<void> =>
      previousPromise
        .then(():Promise<void> =>
        {
          if (definition.function)
            return runFunctionRunnable(definition)

          return runProcessRunnable(definition)
        }),
      Promise.resolve()
    )
}
