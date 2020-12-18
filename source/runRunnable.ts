import { parseStringRunnable } from './parseStringRunnable'
import { resolveRunnableModule } from './resolveRunnableModule'
import { runRunnableModule } from './runRunnableModule'
import { runShellCommand } from './runShellCommand'
import type { Runnable, RunnableModule, RunnableSequence } from './types'

export async function runRunnable (runnable: Runnable, context: string | undefined, runnablesDirectoryPath: string): Promise<Runnable | RunnableSequence | void> {
  if (typeof runnable === 'function') return runnable()
  else if (typeof runnable === 'string') {
    const args: string[] = parseStringRunnable(runnable)

    if (args.length > 0) {
      const name: string = args.shift()!
      let runnableModule: RunnableModule | undefined

      if (!context || name !== context) runnableModule = await resolveRunnableModule(name, runnablesDirectoryPath)

      if (runnableModule) return runRunnableModule(runnableModule, name, args, runnablesDirectoryPath)

      await runShellCommand(name, args)
    }
  }
}
