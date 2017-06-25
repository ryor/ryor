import {existsSync, readdirSync, statSync} from 'fs'
import {parse, resolve} from 'path'

let possibleModuleTypes:string[]
let resolvedModules:{[key:string]:RunnableModule}

export function getPossibleModuleTypes():string[]
{
  if (!possibleModuleTypes)
  {
    const runDirectoryPath:string = resolve(process.cwd(), 'run')

    possibleModuleTypes = []

    readdirSync(runDirectoryPath).forEach((childPath:string):void =>
    {
      const type:string = parse(childPath).name
      const typeDirectoryPath:string = resolve(runDirectoryPath, type)

      if (existsSync(typeDirectoryPath) && statSync(typeDirectoryPath).isDirectory())
        possibleModuleTypes.push(type)
    })
  }

  return possibleModuleTypes
}

export function resolveRunnableModule(name:string):RunnableModule|undefined
{
  if (resolvedModules && resolvedModules[name])
    return resolvedModules[name]

  const runDirectoryPath:string = resolve(process.cwd(), 'run')
  let resolvedModule:RunnableModule|undefined

  getPossibleModuleTypes().forEach((type:string):void =>
  {
    if (!resolvedModule)
    {
      const typeDirectoryPath:string = resolve(runDirectoryPath, type)
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

            if (!resolvedModules)
              resolvedModules = {}

            resolvedModules[name] = resolvedModule
          }
        }

        // TODO: Output module resolution errors in debug mode
        catch (error) {}
      }
    }
  })

  return resolvedModule
}

export function resolveAllRunnableModules():Map<string, Map<string, RunnableModule>>
{
  const modules:Map<string, Map<string, RunnableModule>> = new Map<string, Map<string, RunnableModule>>()
  const runDirectoryPath:string = resolve(process.cwd(), 'run')

  if (existsSync(runDirectoryPath) && statSync(runDirectoryPath).isDirectory())
    readdirSync(runDirectoryPath).forEach((childPath:string):void =>
    {
      const type:string = parse(childPath).name
      const typeDirectoryPath:string = resolve(runDirectoryPath, type)

      if (existsSync(typeDirectoryPath) && statSync(typeDirectoryPath).isDirectory())
      {
        const typeModules:Map<string, RunnableModule> = new Map<string, RunnableModule>()

        readdirSync(typeDirectoryPath).forEach((childPath:string):void =>
        {
          const name:string = parse(childPath).name
          let jsFilePath:string = resolve(typeDirectoryPath, `${name}.js`)

          if (!existsSync(jsFilePath))
            jsFilePath = resolve(typeDirectoryPath, name, 'index.js')

          if (existsSync(jsFilePath))
          {
            try
            {
              const jsModule:RunnableModule = require(jsFilePath)

              if (jsModule.run)
                typeModules.set(name, jsModule)
            }

            // TODO: Output module resolution errors in debug mode
            catch (error) {}
          }
        })

        if (typeModules.size > 0)
          modules.set(type, typeModules)
      }
    })

  return modules
}
