import {existsSync, readdirSync} from 'fs'
import {parse, resolve} from 'path'

const MODULE_TYPES:string[] = ['tasks', 'tools']

export function deleteModulesMap():void
{
  modules = undefined
}

export function getModulesMap():Map<string, Map<string, RunnableModule>>
{
  if (!modules)
  {
    const runDirectoryPath:string = resolve(process.cwd(), 'run')

    modules = new Map<string, Map<string, RunnableModule>>()

    MODULE_TYPES.forEach((type:string):void =>
    {
      if (existsSync(resolve(runDirectoryPath, type)))
        modules!.set(type, new Map<string, RunnableModule>())
    })
  }

  return modules
}

export function getAllModules():Map<string, Map<string, RunnableModule>>
{
  const modules:Map<string, Map<string, RunnableModule>> = getModulesMap()
  const runDirectoryPath:string = resolve(process.cwd(), 'run')

  modules.forEach((map:Map<string, RunnableModule>, type:string):void =>
  {
    readdirSync(resolve(runDirectoryPath, type))
      .forEach((childPath:string):void =>
      {
        const name:string = parse(childPath).name
        let jsFilePath:string = resolve(runDirectoryPath, type, `${name}.js`)

        if (!existsSync(jsFilePath))
          jsFilePath = resolve(runDirectoryPath, type, name, 'index.js')

        if (existsSync(jsFilePath))
        {
          try
          {
            const jsModule:RunnableModule = require(jsFilePath)

            if (jsModule.run)
              map.set(name, jsModule)
          }

          catch (error)
          {
            throw new Error(error.stack.toString())
          }
        }
      })
  })

  return modules
}

export function resolveModule(name:string):RunnableModule|undefined
{
  const modules:Map<string, Map<string, RunnableModule>> = getModulesMap()
  let resolvedModule:RunnableModule|undefined

  modules.forEach((map:Map<string, RunnableModule>):void =>
  {
    if (!resolvedModule && map.has(name))
      resolvedModule = map.get(name)
  })

  if (!resolvedModule)
    modules.forEach((map:Map<string, RunnableModule>, type:string):void =>
    {
      if (!resolvedModule)
      {
        const typeDirectoryPath:string = resolve(process.cwd(), 'run', type)
        let jsFilePath:string = resolve(typeDirectoryPath, `${name}.js`)

        if (!existsSync(jsFilePath))
          jsFilePath = resolve(typeDirectoryPath, name, 'index.js')

        if (existsSync(jsFilePath))
        {
          try
          {
            const jsModule:RunnableModule = require(jsFilePath)

            if (jsModule.run)
            {
              resolvedModule = jsModule

              map.set(name, resolvedModule)
            }
          }

          catch (error)
          {
            throw new Error(error.stack.toString())
          }
        }
      }
    })

  return resolvedModule
}

let modules:Map<string, Map<string, RunnableModule>>|undefined
