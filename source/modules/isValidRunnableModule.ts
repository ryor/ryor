/* eslint-disable @typescript-eslint/no-explicit-any */
import { RunnableModuleError } from '../modules'
import { isValidRunnable, isValidRunnableSequence } from '../runnables'
import { isPopulatedObject } from '../shared'

const INVALID_RUNNABLE_MODULE_ERROR_MESSAGE = 'Invalid runnable module'

const INVALID_RUNNABLE_IN_MODULE_ERROR_MESSAGE = 'Invalid runnable in module'

export function isValidRunnableModule(module: any, debug = false): boolean {
  if (!isPopulatedObject(module)) {
    if (debug) throw new RunnableModuleError(INVALID_RUNNABLE_MODULE_ERROR_MESSAGE)

    return false
  }

  if (!isValidRunnableSequence(module.run) && !isValidRunnable(module.run)) {
    if (debug) throw new RunnableModuleError(INVALID_RUNNABLE_IN_MODULE_ERROR_MESSAGE)

    return false
  }

  if (module.commands !== undefined && (!isPopulatedObject(module.commands) || typeof module.run !== 'function')) {
    if (debug) throw new RunnableModuleError(INVALID_RUNNABLE_MODULE_ERROR_MESSAGE)

    return false
  }

  return true
}
