import { parseStringRunnable } from './parseStringRunnable'
import { resolveRunnableModule } from './resolveRunnableModule'
import { runRunnableModule } from './runRunnableModule'
import { runShellCommand } from './runShellCommand'
import type { Runnable, RunnableModule, RunnableSequence } from './types'

export async function runRunnable (runnable: Runnable, runnablesDirectoryPath: string, context?: string): Promise<Runnable | RunnableSequence | undefined> {
  if (typeof runnable === 'function') return runnable()
  else if (typeof runnable === 'string') {
    const args: string[] = parseStringRunnable(runnable)

    if (args.length > 0) {
      const name: string = args.shift() as string
      let runnableModule: RunnableModule | undefined

      if (context === undefined || name !== context) runnableModule = await resolveRunnableModule(name, runnablesDirectoryPath)

      if (runnableModule !== undefined) await runRunnableModule(runnableModule, name, args, runnablesDirectoryPath)
      else await runShellCommand(name, args)
    }
  }

  return undefined
}
