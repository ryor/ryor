import {bold} from 'chalk'
import {resolve} from 'path'
import {spawn} from 'cross-spawn'
import {parse} from 'shell-quote'
import Runner from './Runner'

export function runRunnable(runnable:Runnable, runner:Runner):Promise<void>
{
  if (runnable.command)
  {
    const {command, args} = runnable

    switch (command)
    {
      case 'cd':
        process.chdir(resolve(process.cwd(), args[0]))
        return Promise.resolve()

      default:
        return new Promise<void>((resolve, reject) =>
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

  return Promise.resolve()
    .then(() => runnable.function!(runnable.args))
    .then((result:RunnableDefinition|void):void => handleFunctionRunnableResult(result, runner))
}

export function handleFunctionRunnableResult(result:RunnableDefinition|void, runner:Runner):void
{
  if (result && (typeof result === 'string' || Array.isArray(result)))
  {
    if (typeof result === 'string')
      runner.operations.unshift(parse(result))

    else
      runner.operations = (result as (string|string[])[])
        .map((definition:string|string[]):RunnableDefinition =>
        {
          if (typeof definition === 'string')
            return parse(definition)

          return [definition]
        })
        .concat(runner.operations as RunnableDefinition[])
  }
}
