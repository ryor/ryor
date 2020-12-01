import { isValidRunnableSequence } from './isValidRunnableSequence'
import { parseRunnableArguments } from './parseRunnableArguments'
import { runRunnableSequence } from './runRunnableSequence'
import type { Runnable, RunnableSequence, RunnableModule } from './types'

export async function runRunnableModule ({ args: definitions = {}, run }:RunnableModule, name:string, args:string[] = []):Promise<void> {
  let item:Runnable|RunnableSequence|undefined = run

  while (typeof item === 'function') item = await item(parseRunnableArguments(definitions, args))

  if (isValidRunnableSequence(item)) await runRunnableSequence(<RunnableSequence>item, name)
}
