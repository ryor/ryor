import { isValidRunnable } from './isValidRunnable'
import { isValidRunnableSequence } from './isValidRunnableSequence'
import { runRunnable } from './runRunnable'
import type { Runnable, RunnableSequence } from './types'

const SHORT_CONCURRENT_FLAG: string = '-c'

const LONG_CONCURRENT_FLAG: string = '--concurrent'

export async function runRunnableSequence (sequence: Runnable | RunnableSequence, context: string | undefined, runnablesDirectoryPath: string): Promise<void> {
  if (!Array.isArray(sequence)) sequence = [sequence]

  if (sequence.length > 0) {
    if (typeof sequence[0] === 'string' && [SHORT_CONCURRENT_FLAG, LONG_CONCURRENT_FLAG].includes(sequence[0])) {
      sequence.shift()
      await Promise.all(sequence.map((item): Promise<void> => runRunnableSequence(item, context, runnablesDirectoryPath)))
    } else {
      while (sequence.length > 0) {
        const item: Runnable | RunnableSequence = sequence.shift()!

        if (Array.isArray(item)) {
          if (isValidRunnableSequence(item)) await runRunnableSequence(item, context, runnablesDirectoryPath)
        } else if (isValidRunnable(item)) {
          const result: Runnable | RunnableSequence | void = await runRunnable(item, context, runnablesDirectoryPath)

          if (result) sequence.unshift(result)
        }
      }
    }
  }
}
