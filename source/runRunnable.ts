import { parseStringRunnable } from './parseStringRunnable'
import { resolveRunnableModule } from './resolveRunnableModule'
import { runRunnableModule } from './runRunnableModule'
import { runShellCommand } from './runShellCommand'
import type { Runnable, RunnableModule, RunnableSequence } from './types'

export async function runRunnable (runnable:Runnable, context?:string):Promise<Runnable | RunnableSequence | void> {
  if (typeof runnable === 'function') return runnable()
  else {
    const args:string[] = parseStringRunnable(runnable)

    if (args.length > 0) {
      const name:string = args.shift()!
      let runnableModule:RunnableModule|undefined

      if (!context || name !== context) runnableModule = await resolveRunnableModule(name)

      if (runnableModule) return runRunnableModule(runnableModule, name, args)

      await runShellCommand(name, args)
    }
  }
}
