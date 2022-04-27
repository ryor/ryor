import chalk from 'chalk'
import { ChildProcess } from 'child_process'
import { spawn } from 'cross-spawn'
import { resolve } from 'path'
import { RunnableError } from '../runnables'

const ENOENT_ERROR_TEMPLATE: string = 'Error: spawn [COMMAND] ENOENT'

const UNRESOLVED_COMMAND_ERROR_TEMPLATE: string = `Could not resolve ${chalk.bold('[COMMAND]')}`

export async function runShellCommand (command: string, args: string[] = []): Promise<void> {
  if (command === 'cd') {
    // TODO: Make sure paths with directory names with spaces are handled properly
    if (args.length > 0) process.chdir(resolve(process.cwd(), args.join(' ')))

    return await Promise.resolve()
  }

  if (command === 'echo') {
    console.log(args.join(' '))

    return await Promise.resolve()
  }

  return await new Promise<void>((resolve: () => void, reject: (error: Error) => void): void => {
    const childProcess: ChildProcess = spawn(command, args, { env: process.env, stdio: 'inherit' })
    let processErrorMessages: string = ''

    childProcess.on('error', (data: Buffer): void => { processErrorMessages += data.toString() })

    childProcess.on('close', (code: number): void => {
      processErrorMessages = processErrorMessages.trim()

      if (code !== 0) {
        reject(
          processErrorMessages === ENOENT_ERROR_TEMPLATE.replace('[COMMAND]', command)
            ? new RunnableError(UNRESOLVED_COMMAND_ERROR_TEMPLATE.replace('[COMMAND]', command))
            : new Error(processErrorMessages)
        )
      } else {
        if (processErrorMessages !== '') console.error(processErrorMessages)

        resolve()
      }
    })
  })
}
