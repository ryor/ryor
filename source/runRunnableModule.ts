import { isValidRunnableSequence } from './isValidRunnableSequence'
import { runRunnableSequence } from './runRunnableSequence'
import type { Runnable, RunnableSequence, RunnableModule } from './types'

export async function runRunnableModule ({ run }:RunnableModule, name:string, args:string[] = []):Promise<void> {
  let item:Runnable|RunnableSequence|undefined = run

  while (typeof item === 'function') item = await item(args)

  if (isValidRunnableSequence(item)) await runRunnableSequence(<RunnableSequence>item, name)
}
