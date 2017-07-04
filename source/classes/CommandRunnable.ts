import {bold} from 'chalk'
import {spawn} from 'cross-spawn'
import {resolve} from 'path'

export class CommandRunnable implements Runnable
{
  public constructor(public command:string, public args:string[] = []) {}

  public run():Promise<void>
  {
    const {command, args}:CommandRunnable = this

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
          const childProcess:NodeJS.EventEmitter = spawn(command, args, {env:process.env as {[key:string]:string}, stdio:'inherit'})
          let error:string = ''

          childProcess.on('error', (data:Buffer):string => error += data.toString())

          childProcess.on('close', (code:number):void =>
          {
            error = error.trim()

            if (code !== 0)
            {
              if (error === `Error: spawn ${command} ENOENT`)
                error = `Could not resolve ${bold(command)}`

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
}
