import { isValidRunnable } from './isValidRunnable'
import { isValidRunnableSequence } from './isValidRunnableSequence'
import { runRunnable } from './runRunnable'
import type { Runnable, RunnableSequence } from './types'

const SHORT_CONCURRENT_FLAG: string = '-c'

const LONG_CONCURRENT_FLAG: string = '--concurrent'

export async function runRunnableSequence (sequence: Runnable | RunnableSequence, runnablesDirectoryPath: string, context?: string): Promise<void> {
  if (!Array.isArray(sequence)) sequence = [sequence]

  if (sequence.length > 0) {
    if (typeof sequence[0] === 'string' && [SHORT_CONCURRENT_FLAG, LONG_CONCURRENT_FLAG].includes(sequence[0])) {
      sequence.shift()
      await Promise.all(sequence.map(async (item: Runnable | RunnableSequence): Promise<void> => await runRunnableSequence(item, runnablesDirectoryPath, context)))
    } else {
      while (sequence.length > 0) {
        const item: Runnable | RunnableSequence = sequence.shift() as Runnable | RunnableSequence

        if (Array.isArray(item)) {
          if (isValidRunnableSequence(item)) await runRunnableSequence(item, runnablesDirectoryPath, context)
        } else if (isValidRunnable(item)) {
          const result: Runnable | RunnableSequence | undefined = await runRunnable(item, runnablesDirectoryPath, context)

          if (result !== undefined) sequence.unshift(result as Runnable)
        }
      }
    }
  }
}
