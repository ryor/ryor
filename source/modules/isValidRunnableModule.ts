import { RunnableModuleError } from '../modules'
import { isValidRunnable, isValidRunnableSequence } from '../runnables'
import { isPopulatedObject } from '../shared'

export function isValidRunnableModule (module: any, debug: boolean = false): boolean {
  if (!isPopulatedObject(module)) {
    if (debug) throw new RunnableModuleError('Invalid runnable module')

    return false
  }

  if (!isValidRunnableSequence(module.run) && !isValidRunnable(module.run)) {
    if (debug) throw new RunnableModuleError('Invalid runnable in module')

    return false
  }

  if (module.commands !== undefined && (!isPopulatedObject(module.commands) || typeof module.run !== 'function')) {
    if (debug) throw new RunnableModuleError('Invalid runnable module')

    return false
  }

  return true
}
