import chalk from 'chalk'
import { ChildProcess, SpawnOptions } from 'child_process'
import { spawn } from 'cross-spawn'
import { RunnableError } from '../runnables'

const ENOENT_ERROR_TEMPLATE: string = 'Error: spawn [COMMAND] ENOENT'

const UNRESOLVED_COMMAND_ERROR_TEMPLATE: string = `Could not resolve ${chalk.bold('[COMMAND]')}`

export async function runShellCommand (command: string, args: string[] = [], spawnOptions: SpawnOptions = {}): Promise<void> {
  return await new Promise<void>((resolve: () => void, reject: (error: Error) => void): void => {
    const childProcess: ChildProcess = spawn(command, args, { env: { ...process.env, FORCE_COLOR: 'true' }, stdio: 'inherit', ...spawnOptions })
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
