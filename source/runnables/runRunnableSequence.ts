import { isValidRunnable } from './isValidRunnable'
import { isValidRunnableSequence } from './isValidRunnableSequence'
import { runRunnable } from './runRunnable'
import { SHORT_CONCURRENT_FLAG, LONG_CONCURRENT_FLAG } from './constants'
import type { RunnerConfiguration } from '../runner'
import type { Runnable, RunnableSequence } from './types'

export async function runRunnableSequence (sequence: RunnableSequence, configuration: RunnerConfiguration, context?: string): Promise<void> {
  if (typeof sequence[0] === 'string' && [SHORT_CONCURRENT_FLAG, LONG_CONCURRENT_FLAG].includes(sequence[0])) {
    sequence.shift()

    await Promise.all(sequence.map(async (item: Runnable | RunnableSequence): Promise<void> => {
      if (Array.isArray(item)) {
        if (isValidRunnableSequence(item)) await runRunnableSequence(item, configuration, context)
      } else if (isValidRunnable(item)) await runRunnable(item, configuration, context)
    }))
  } else {
    while (sequence.length > 0) {
      const item: Runnable | RunnableSequence = sequence.shift() as Runnable | RunnableSequence

      if (Array.isArray(item)) {
        if (isValidRunnableSequence(item)) await runRunnableSequence(item, configuration, context)
      } else if (isValidRunnable(item)) {
        const result: Runnable | RunnableSequence | undefined = await runRunnable(item, configuration, context)

        if (result !== undefined) sequence.unshift(result as Runnable)
      }
    }
  }
}
