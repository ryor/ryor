import { RunnableArgumentDefinitions } from '../runnables'

const RUNNABLE_MODULE_HELP_ARGUMENT_DESCRIPTION = 'Displays this usage information'

export function ensureRunnableModuleHelpArgumentDefinition(definitions: RunnableArgumentDefinitions = {}) {
  return {
    ...definitions,
    help: {
      alias: 'h',
      description: RUNNABLE_MODULE_HELP_ARGUMENT_DESCRIPTION,
      type: 'boolean'
    }
  } as RunnableArgumentDefinitions
}
