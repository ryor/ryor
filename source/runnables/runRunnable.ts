import { resolve } from 'path'
import { RunnableModule, resolveRunnableModule, runRunnableModule } from '../modules'
import { RunnerConfiguration } from '../runner'
import { killChildProcesses } from '../shared'
import { parseStringRunnable } from './parseStringRunnable'
import { runShellCommand } from './runShellCommand'
import { Runnable } from './types'

export async function runRunnable(runnable: Runnable, configuration: RunnerConfiguration, context?: string) {
  if (typeof runnable === 'function') return runnable()
  else if (typeof runnable === 'string') {
    const args = parseStringRunnable(runnable)

    if (args.length > 0) {
      if (args[0] === 'exit') {
        await killChildProcesses()
        process.exit(args.length > 1 ? Number(args[1]) : 0)
      } else if (args[0] === 'cd') {
        // TODO: Make sure paths with directory names with spaces are handled properly
        if (args.length > 1) process.chdir(resolve(process.cwd(), args.slice(1).join(' ')))
      } else if (args[0] === 'echo') console.log(args.slice(1).join(' '))
      else if (args[0].startsWith('cwd=')) {
        const cwd = resolve(process.cwd(), (args.shift() as string).split('=')[1])
        const command = args.shift() as string

        await runShellCommand(command, args, { cwd })
      } else {
        const name = args.shift() as string
        let runnableModule: RunnableModule | undefined

        if (context === undefined || name !== context) runnableModule = await resolveRunnableModule(name, configuration)

        if (runnableModule !== undefined) await runRunnableModule(runnableModule, name, args, configuration)
        else await runShellCommand(name, args)
      }
    }
  }

  return undefined
}
