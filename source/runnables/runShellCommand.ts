import { bold } from 'chalk'
import { ChildProcess } from 'child_process'
import { spawn } from 'cross-spawn'
import { resolve } from 'path'
import { RunnableError } from '../runnables'
import { WINDOWS_IDENTIFIER, getPathStats } from '../shared'

const WINDOWS_IDENTIFIER: string = 'win32'

export async function runShellCommand (command: string, args: string[] = []): Promise<void> {
  if (command === 'cd') {
    // TODO: Make sure paths with directory names with spaces are handled properly
    if (args.length > 0) process.chdir(resolve(process.cwd(), args.join(' ')))

    return await Promise.resolve()
  }

  if (process.platform === WINDOWS_IDENTIFIER && await getPathStats(resolve(process.cwd(), 'node_modules/.bin', `${command}.cmd`)) !== undefined) command = `${command}.cmd`

  return await new Promise<void>((resolve: () => void, reject: (error: Error) => void): void => {
    const childProcess: ChildProcess = spawn(command, args, { env: process.env, stdio: 'inherit' })
    let stdError: string = ''

    childProcess.on('error', (data: Buffer): void => { stdError += data.toString() })

    childProcess.on('close', (code: number): void => {
      stdError = stdError.trim()

      if (code !== 0) reject(stdError === `Error: spawn ${command} ENOENT` ? new RunnableError(`Could not resolve ${bold(command)}`) : new Error(stdError))
      else {
        if (stdError !== '') console.error(stdError)

        resolve()
      }
    })
  })
}
