import { existsSync, readdirSync, statSync } from 'fs'
import { parse, resolve } from 'path'

let possibleModuleTypes:string[]|undefined
let resolvedModules:Map<string, RunnableModule>|undefined

export function getPossibleModuleTypes ():string[] {
  if (possibleModuleTypes === undefined) {
    const runDirectoryPath:string = resolve(process.cwd(), 'run')

    possibleModuleTypes = []

    if (existsSync(runDirectoryPath) && statSync(runDirectoryPath).isDirectory()) {
      readdirSync(runDirectoryPath).forEach((childPath:string):void => {
        const type:string = parse(childPath).name
        const typeDirectoryPath:string = resolve(runDirectoryPath, type)

        if (existsSync(typeDirectoryPath) && statSync(typeDirectoryPath).isDirectory()) possibleModuleTypes!.push(type)
      })
    }
  }

  return possibleModuleTypes
}

export function resolveRunnableModule (name:string):RunnableModule|undefined {
  if (resolvedModules !== undefined && resolvedModules.has(name)) return resolvedModules.get(name)

  const runDirectoryPath:string = resolve(process.cwd(), 'run')
  let resolvedModule:RunnableModule|undefined

  getPossibleModuleTypes().forEach((type:string):void => {
    if (resolvedModule === undefined) {
      const typeDirectoryPath:string = resolve(runDirectoryPath, type)
      let jsFilePath:string = resolve(typeDirectoryPath, `${name}.js`)

      if (!existsSync(jsFilePath)) jsFilePath = resolve(typeDirectoryPath, name, 'index.js')

      if (existsSync(jsFilePath)) {
        const jsModule:RunnableModule|{run?:{}} = <RunnableModule|{run?:{}}>require(jsFilePath)

        if (jsModule.run !== undefined) {
          resolvedModule = <RunnableModule>jsModule

          if (resolvedModules === undefined) resolvedModules = new Map<string, RunnableModule>()

          resolvedModules.set(name, resolvedModule)
        }
      }
    }
  })

  return resolvedModule
}

export function resolveAllRunnableModules ():Map<string, Map<string, RunnableModule>> {
  const modules:Map<string, Map<string, RunnableModule>> = new Map<string, Map<string, RunnableModule>>()
  const runDirectoryPath:string = resolve(process.cwd(), 'run')

  if (existsSync(runDirectoryPath) && statSync(runDirectoryPath).isDirectory()) {
    getPossibleModuleTypes().forEach((type:string):void => {
      const typeDirectoryPath:string = resolve(runDirectoryPath, type)
      const typeModules:Map<string, RunnableModule> = new Map<string, RunnableModule>()

      readdirSync(typeDirectoryPath).forEach((possibleModulePath:string):void => {
        const name:string = parse(possibleModulePath).name
        let jsFilePath:string = resolve(typeDirectoryPath, `${name}.js`)

        if (!existsSync(jsFilePath)) jsFilePath = resolve(typeDirectoryPath, name, 'index.js')

        if (existsSync(jsFilePath)) {
          const jsModule:RunnableModule|{run?:{}} = <RunnableModule|{run?:{}}>require(jsFilePath)

          if (jsModule.run !== undefined) typeModules.set(name, <RunnableModule>jsModule)
        }
      })

      if (typeModules.size > 0) modules.set(type, typeModules)
    })
  }

  return modules
}

// For testing
export function clear ():void {
  possibleModuleTypes = undefined
  resolvedModules = undefined
}
