import { bold } from 'chalk'
import { spawn } from 'cross-spawn'
import { resolve } from 'path'
import type { ChildProcess } from 'child_process'

export function runShellCommand (command:string, args:string[] = []):Promise<void> {
  if (command === 'cd') {
    // TODO: Make sure paths with directory names with spaces are handled properly
    if (args.length > 0) process.chdir(resolve(process.cwd(), args[0]))

    return Promise.resolve()
  }

  return new Promise<void>((resolve:() => void, reject:(error:Error) => void):void => {
    const childProcess:ChildProcess = spawn(command, args, { env: process.env, stdio: 'inherit' })
    let error:string = ''

    childProcess.on('error', (data:Buffer):void => { error += data.toString() })

    childProcess.on('close', (code:number):void => {
      error = error.trim()

      if (code !== 0) {
        if (error === `Error: spawn ${command} ENOENT`) error = `Could not resolve ${bold(command)}`

        reject(new Error(error))
      } else {
        if (error !== '') console.error(error)

        resolve()
      }
    })
  })
}
