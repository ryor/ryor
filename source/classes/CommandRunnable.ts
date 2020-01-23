import chalk from 'chalk'
import { spawn } from 'cross-spawn'
import * as path from 'path'

export class CommandRunnable implements Runnable {
  // eslint-disable-next-line no-useless-constructor
  public constructor (public command:string, public args:string[] = []) {}

  public run ():Promise<void> {
    switch (this.command) {
      case 'cd':

        // TODO: Make sure paths with directory names with spaces are handled properly
        if (this.args.length > 0) process.chdir(path.resolve(process.cwd(), this.args[0]))

        return Promise.resolve()

      default:
        return new Promise<void>((resolve:() => void, reject:(error:string) => void):void => {
          try {
            const childProcess:NodeJS.EventEmitter = spawn(this.command, this.args, { env: process.env as {[key:string]:string}, stdio: 'inherit' })
            let error:string = ''

            childProcess.on('error', (data:Buffer):string => (error += data.toString()))

            childProcess.on('close', (code:number):void => {
              error = error.trim()

              if (code !== 0) {
                if (error === `Error: spawn ${this.command} ENOENT`) { error = `Could not resolve ${chalk.bold(this.command)}` }

                reject(error)
              } else {
                if (error !== '') { console.error(error) }

                resolve()
              }
            })
          } catch (error) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(`Error encountered spawning child process with command ${chalk.bold(this.command)}: ${(error as Error).message}`)
          }
        })
    }
  }
}
