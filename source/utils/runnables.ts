import {bold} from 'chalk'
import {spawn} from 'cross-spawn'
import {resolve} from 'path'
import {parse} from 'shell-quote'
import {Runner} from '../Runner'
import {resolveRunnableModule} from './modules'

export function resolveRunnable(definition:RunnableDefinition, context?:string):Runnable|Runner
{
  if (typeof definition === 'string')
    definition = parse(definition)

  let name:string = definition[0]
  let args:string[] = definition.slice(1)

  if (context !== undefined && name === context)
    return {command:name, args, context}

  const runnableModule:RunnableModule|undefined = resolveRunnableModule(name)

  if (runnableModule !== undefined)
  {
    const {run}:RunnableModule = runnableModule

    context = name

    if (typeof run === 'function')
      return {function:run, args, context}

    if (typeof run === 'string')
    {
      definition = parse(run)
      name = definition[0]
      args = definition.slice(1)

      if (name === context)
        return {command:name, args, context}

      return resolveRunnable(definition, context)
    }

    if (Array.isArray(run))
      return new Runner(run, context)

    else
      throw new Error(String({run, context}))
  }

  else
    return {command:name, args, context}
}

export function runRunnable(runnable:Runnable):Promise<RunnableDefinition|RunnableDefinition[]|void>
{
  if (runnable.function !== undefined)
    return Promise.resolve().then(():RunnableDefinition|void|Promise<RunnableDefinition|void> => runnable.function!(runnable.args))

  const {command, args}:Runnable = runnable
  let promise:Promise<void>

  switch (command)
  {
    case 'cd':
      process.chdir(resolve(process.cwd(), args[0]))
      promise = Promise.resolve()
      break

    default:
      promise = new Promise<void>((resolve:() => void, reject:(error:string) => void):void =>
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

  return promise
}
