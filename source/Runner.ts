import {spawn} from 'cross-spawn'
import {resolve} from 'path'
import {parse} from 'shell-quote'
import {resolveModule} from './utils/modules'

export default class Runner
{
  static resolveRunnable(definition:RunnableDefinition):Runnable|Runner
  {
    if (typeof definition[0] === 'string')
    {
      const runnableModule:RunnableModule|undefined = resolveModule(definition[0] as string)

      if (runnableModule)
      {
        const {run} = runnableModule

        if (typeof run === 'function')
          return {function:run, args:definition.slice(1) as string[]}

        else if (typeof run === 'string')
        {
          definition = parse(run)

          return {command:definition[0], args:definition.slice(1)}
        }

        else
          return new Runner((run as string[]).map((item:string):RunnableDefinition =>
          {
            if (typeof item === 'string')
              return parse(item)

            return [item]
          }))
      }

      else
        return {command:definition[0] as string, args:definition.slice(1) as string[]}
    }

    else
      return new Runner(definition[0] as RunnableDefinition[], 'parallel')
  }

  constructor(public definitions:RunnableDefinition[], public type:string = 'series') {}

  public run():Promise<void>
  {
    return this.doNext()
  }

  runRunnable(definition:RunnableDefinition):Promise<void>
  {
    const runnable:Runnable|Runner = Runner.resolveRunnable(definition)
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
              let errors = ''

              childProcess.on('error', data => errors += data.toString())

              childProcess.on('close', code =>
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

  doNext():Promise<void>
  {
    if (this.definitions.length > 0)
    {
      if (this.type === 'series')
      {
        const definition:RunnableDefinition = this.definitions.shift() as RunnableDefinition

        return this.runRunnable(definition).then(():Promise<void> => this.doNext())
      }

      else
      {
        const promises = this.definitions.map(definition => this.runRunnable(definition))

        this.definitions = []

        return Promise.all(promises).then(():Promise<void> => this.doNext())
      }
    }

    return Promise.resolve()
  }
}
