import {bold} from 'chalk'
import {existsSync, readdirSync} from 'fs'
import {EOL} from 'os'
import {parse, resolve} from 'path'
import * as shellQuote from 'shell-quote'
import Runner from './Runner'
import {capitalize, maxStringLength, padStringWithSpaces} from './utils'

const MODULE_TYPES:string[] = ['tasks', 'tools']

export default class Resolver
{
  public modules:Map<string, Map<string, RunnableModule>>

  constructor()
  {
    const binDirectoryPath:string = resolve(process.cwd(), 'node_modules/.bin')
    const runDirectoryPath:string = resolve(process.cwd(), 'run')

    if (existsSync(binDirectoryPath))
        process.env.PATH = `${process.env.PATH}${process.platform === 'win32' ? ';' : ':'}${binDirectoryPath}`

    this.modules = new Map<string, Map<string, RunnableModule>>()

    MODULE_TYPES.forEach((type:string):void =>
    {
      if (existsSync(resolve(runDirectoryPath, type)))
        this.modules.set(type, new Map<string, RunnableModule>())
    })
  }

  resolveRunnable(definition:RunnableDefinition):Runnable|Runner
  {
    if (typeof definition === 'string')
      definition = shellQuote.parse(definition)

    if (typeof definition[0] === 'string')
    {
      const runnableModule:RunnableModule|undefined = this.resolveRunnableModule(definition[0] as string)

      if (runnableModule)
      {
        const {run} = runnableModule

        if (typeof run === 'function')
          return {function:run, args:definition.slice(1) as string[]}

        else if (typeof run === 'string')
        {
          definition = shellQuote.parse(run)

          return {command:definition[0], args:definition.slice(1)}
        }

        else
          return new Runner((run as string[]).map((item:string):RunnableDefinition =>
          {
            if (typeof item === 'string')
              return shellQuote.parse(item)

            return [item]
          }), this)
      }

      else
        return {command:definition[0] as string, args:definition.slice(1) as string[]}
    }

    else
      return new Runner(definition[0] as RunnableDefinition[], this, 'parallel')
  }

  resolveRunnableModule(name:string):RunnableModule|undefined
  {
    let resolvedModule:RunnableModule|undefined

    this.modules.forEach((map:Map<string, RunnableModule>):void =>
    {
      if (!resolvedModule && map.has(name))
        resolvedModule = map.get(name)
    })

    if (!resolvedModule)
      this.modules.forEach((map:Map<string, RunnableModule>, type:string):void =>
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

  resolveAllRunnableModules():Map<string, Map<string, RunnableModule>>
  {
    const runDirectoryPath:string = resolve(process.cwd(), 'run')

    this.modules.forEach((map:Map<string, RunnableModule>, type:string):void =>
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

    return this.modules
  }

  composeUsageInformation():string
  {
    const runnableKeys:Set<string> = new Set<string>()
    let lists:string[] = []

    this.resolveAllRunnableModules()

    this.modules.forEach((typeModules:Map<string, RunnableModule>, type:string):void =>
    {
      const keys:string[] = Array.from(typeModules.keys())
      const maxKeyLength:number = maxStringLength(keys)
      let items:string[] = []

      typeModules.forEach(({description}:RunnableModule, key:string):void =>
      {
        items.push(`  ${bold(padStringWithSpaces(key, maxKeyLength))}    ${description || 'No description provided'}`)
        runnableKeys.add(key)
      })

      lists.push(`${bold(`${capitalize(type)}:`)}${EOL}${EOL}${items.join(EOL)}`)
    })

    const binDirectoryPath:string = resolve(process.cwd(), 'node_modules', '.bin')

    if (existsSync(binDirectoryPath))
    {
      const binKeys:Set<string> = new Set<string>()

      readdirSync(binDirectoryPath).forEach((fileName:string):void =>
      {
        const name:string = parse(fileName).name

        if (!runnableKeys.has(name))
          binKeys.add(name)
      })

      if (binKeys.size > 0)
        lists.push(`${bold('bin:')} ${Array.from(binKeys).map((key:string):string => bold(key)).join(' ')}`)
    }

    return `${bold('Usage:')} node run <runnable> [args...] [+ <runnable> [args...]] ...${EOL}${EOL}${lists.join(`${EOL}${EOL}`)}`
  }
}
