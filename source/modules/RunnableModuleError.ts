import { INVALID_RUNNABLE_MODULE_ERROR_MESSAGE } from './constants'

export class RunnableModuleError extends Error {
  constructor (modulePath: string) {
    super(INVALID_RUNNABLE_MODULE_ERROR_MESSAGE.replace('[MODULE_PATH]', modulePath))
    this.name = 'InvalidRunnableModuleError'
  }
}
