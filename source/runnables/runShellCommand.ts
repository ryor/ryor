import chalk from 'chalk'
import { ChildProcess, SpawnOptions } from 'child_process'
import { spawn } from 'cross-spawn'

const ENOENT_ERROR_TEMPLATE = 'Error: spawn [COMMAND] ENOENT'

const UNRESOLVED_COMMAND_ERROR_TEMPLATE = `Could not resolve ${chalk.bold('[COMMAND]')}`

export async function runShellCommand(command: string, args: string[] = [], spawnOptions: SpawnOptions = {}): Promise<void> {
  return await new Promise<void>((resolve: () => void, reject: (error: Error) => void): void => {
    const childProcess: ChildProcess = spawn(command, args, { env: { ...process.env, FORCE_COLOR: 'true' }, stdio: 'inherit', ...spawnOptions })
    let error = ''

    childProcess.on('error', (data: Buffer): void => {
      error += data.toString()
    })

    childProcess.on('close', (code: number): void => {
      error = error.trim()

      if (code !== 0) {
        reject(
          new Error(error === ENOENT_ERROR_TEMPLATE.replace('[COMMAND]', command) ? UNRESOLVED_COMMAND_ERROR_TEMPLATE.replace('[COMMAND]', command) : error)
        )
      } else {
        if (error !== '') console.error(error)
        resolve()
      }
    })
  })
}
