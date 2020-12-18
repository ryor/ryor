import esm from 'esm'
import { isValidRunnableSequence } from './isValidRunnableSequence'
import type { RunnableModule } from './types'

const INVALID_RUNNABLE_ERROR_TEMPLATE: string = 'Invalid runnable defined in [PATH]'

const NO_RUNNABLE_ERROR_TEMPLATE: string = 'No runnable defined in [PATH]'

const esmRequire: typeof require = esm(module)

export function requireRunnableModule (path: string): RunnableModule {
  const runnableModule: RunnableModule = esmRequire(path)

  if (!runnableModule || runnableModule.run === undefined) throw new Error(NO_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', require.resolve(path).replace(process.cwd(), '.')))

  if (!isValidRunnableSequence(runnableModule.run)) throw new Error(INVALID_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', require.resolve(path).replace(process.cwd(), '.')))

  return runnableModule
}
