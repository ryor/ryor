import { resolveRunnableModule, runRunnableModule } from '../modules'
import { parseStringRunnable } from './parseStringRunnable'
import { runShellCommand } from './runShellCommand'
import type { RunnableModule } from '../modules'
import type { RunnerConfiguration } from '../runner'
import type { Runnable, RunnableSequence } from './types'

export async function runRunnable (runnable: Runnable, configuration: RunnerConfiguration, context?: string): Promise<Runnable | RunnableSequence | undefined> {
  if (typeof runnable === 'function') return runnable()
  else if (typeof runnable === 'string') {
    const args: string[] = parseStringRunnable(runnable)

    if (args.length > 0) {
      if (args[0] === 'exit') process.exit(args.length > 1 ? Number(args[1]) : undefined)

      else {
        const name: string = args.shift() as string
        let runnableModule: RunnableModule | undefined

        if (context === undefined || name !== context) runnableModule = await resolveRunnableModule(name, configuration)

        if (runnableModule !== undefined) await runRunnableModule(runnableModule, name, args, configuration)
        else await runShellCommand(name, args)
      }
    }
  }

  return undefined
}
