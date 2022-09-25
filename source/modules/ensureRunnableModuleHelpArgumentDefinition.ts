import { RUNNABLE_MODULE_HELP_ARGUMENT_DESCRIPTION } from './constants'
import type { RunnableArgumentDefinitions } from '../runnables'

export function ensureRunnableModuleHelpArgumentDefinition(definitions: RunnableArgumentDefinitions = {}): RunnableArgumentDefinitions {
  return {
    ...definitions,
    help: {
      alias: 'h',
      description: RUNNABLE_MODULE_HELP_ARGUMENT_DESCRIPTION,
      type: 'boolean'
    }
  }
}
