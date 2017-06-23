import {bold} from 'chalk'
import {spawn} from 'cross-spawn'
import {resolve} from 'path'
import {parse} from 'shell-quote'
import Resolver from './Resolver'

export default class Runner
{
  constructor(public definitions:RunnableDefinition[], public resolver:Resolver, public type:string = 'series') {}

  public run():Promise<void>
  {
    return this.next()
  }

  public runRunnable(definition:RunnableDefinition):Promise<void>
  {
    const runnable:Runnable|Runner = this.resolver.resolveRunnable(definition)
    let promise:Promise<string|(string|string[]|void)[]|void>

    if (runnable instanceof Runner)
      promise = runnable.run()

    else
      if (runnable.command)
      {
        const {command, args} = runnable

        switch (command)
        {
          case 'cd':
            process.chdir(resolve(process.cwd(), args[0]))
            promise = Promise.resolve()
            break

          default:
            promise = new Promise((resolve, reject) =>
            {
              const childProcess:NodeJS.EventEmitter = spawn(command!, args, {env:process.env, stdio:'inherit'})
              let error:string = ''

              childProcess.on('error', data => error += data.toString())

              childProcess.on('close', code =>
              {
                error = error.trim()

                if (code !== 0)
                {
                  if (error === `Error: spawn ${command} ENOENT`)
                    error = `Could not resolve ${bold(command!)} command`

                  return reject(error)
                }

                else
                {
                  if (error)
                    console.error(error)

                  resolve()
                }
              })
            })
        }
      }

      else
        promise = Promise.resolve().then(() => runnable.function!(runnable.args))

    return promise.then((result:string|(string|string[]|void)[]|void):void =>
    {
      if (result && (typeof result === 'string' || Array.isArray(result)))
      {
        if (typeof result === 'string')
          this.definitions.unshift(result)

        else
          this.definitions = (result as (string|string[]|void)[])
            .filter((item:string|string[]|void):boolean => !!item && (typeof item === 'string' || Array.isArray(item)))
            .map((item:string|string[]):RunnableDefinition =>
            {
              if (typeof item === 'string')
                return parse(item)

              return [item]
            })
            .concat(this.definitions)
      }
    })
  }

  private next():Promise<void>
  {
    if (this.definitions.length > 0)
    {
      if (this.type === 'series')
      {
        const definition:RunnableDefinition = this.definitions.shift() as RunnableDefinition

        return this.runRunnable(definition).then(():Promise<void> => this.next())
      }

      else
      {
        const promises = this.definitions.map(definition => this.runRunnable(definition))

        this.definitions = []

        return Promise.all(promises).then(():Promise<void> => this.next())
      }
    }

    return Promise.resolve()
  }
}
