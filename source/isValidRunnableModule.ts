import { isValidRunnableSequence } from './isValidRunnableSequence'
import type { RunnableModule } from './types'

export function isValidRunnableModule (module: NodeModule): boolean {
  return (module as RunnableModule).run !== undefined && isValidRunnableSequence((module as RunnableModule).run)
}
