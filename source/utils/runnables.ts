import {bold} from 'chalk'
import {spawn} from 'cross-spawn'
import {resolve} from 'path'
import {parse} from 'shell-quote'
import {Runner} from '../Runner'
import {resolveRunnableModule} from './modules'

export function resolveRunnable(definition:RunnableDefinition, context?:string):Runnable|Runner
{
  if (!(typeof definition === 'string' || Array.isArray(definition)))
    throw new Error(`Invalid definition passed to resolveRunnable function: ${bold(JSON.stringify(definition))}`)

  if (typeof definition === 'string')
  {
    if (definition === '')
      throw new Error(`Invalid definition passed to resolveRunnable function: ${bold('empty string')}`)

    definition = parse(definition)
  }

  let name:string = definition[0]
  let args:string[] = definition.slice(1)

  if (context !== undefined && name === context)
    return {command:name, args, context}

  const runnableModule:RunnableModule|undefined = resolveRunnableModule(name)

  if (runnableModule !== undefined)
  {
    const {run}:RunnableModule = runnableModule

    context = name

    if (Array.isArray(run))
      return new Runner(run, name)

    if (typeof run === 'function')
      return {function:run, args, context}

    if (typeof run === 'string' && run.length > 0)
    {
      definition = parse(run)
      name = definition[0]
      args = definition.slice(1)

      if (name === context)
        return {command:name, args, context}

      return resolveRunnable(definition, context)
    }

    if (typeof run === 'object' && (run.command !== undefined || run.function !== undefined))
      return {...run, context}

    const errorValue:string = typeof run === 'string' ? run.length === 0 ? 'empty string' : run : JSON.stringify(run)

    throw new Error(`Unexpected ${bold('run')} value encountered in ${bold(name)} module: ${bold(errorValue)}`)
  }

  return {command:name, args, context}
}

export function runRunnable(runnable:Runnable):Promise<RunnableDefinition|RunnableDefinition[]|void>
{
  if (runnable.command !== undefined)
  {
    const {command}:Runnable = runnable
    const args:string[] = runnable.args !== undefined ? runnable.args : []

    switch (command)
    {
      case 'cd':

        // TODO: Make sure paths with directory names with spaces are handled properly
        if (args.length > 0)
          process.chdir(resolve(process.cwd(), args[0]))

        return  Promise.resolve()

      default:
        return new Promise<void>((resolve:() => void, reject:(error:string) => void):void =>
        {
          const childProcess:NodeJS.EventEmitter = spawn(command!, args, {env:process.env as {[key:string]:string}, stdio:'inherit'})
          let error:string = ''

          childProcess.on('error', (data:Buffer):string => error += data.toString())

          childProcess.on('close', (code:number):void =>
          {
            error = error.trim()

            if (code !== 0)
            {
              if (error === `Error: spawn ${command} ENOENT`)
                error = `Could not resolve ${bold(command!)}`

              reject(error)
            }

            else
            {
              if (error !== '')
                console.error(error)

              resolve()
            }
          })
        })
    }
  }

  if (runnable.function !== undefined)
    return Promise.resolve().then(():RunnableDefinition|void|Promise<RunnableDefinition|void> => runnable.function!(runnable.args))

  throw new Error(`Invalid runnable passed to runRunnable function: ${bold(JSON.stringify(runnable))}`)
}
