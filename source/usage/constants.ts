import chalk from 'chalk'

export const DEFAULT_ITEM_DESCRIPTION = 'No description provided'

export const MAIN_USAGE_HEADER = `${chalk.bold('Usage:')} node [ENTRY_DIRECTORY_NAME] [option] <runnable> [args...] [+ <runnable> [args...]] ...`

export const MAIN_USAGE_FOOTER = `Use ${chalk.bold(
  'node [ENTRY_DIRECTORY_NAME] <runnable> -h/--help'
)} for detailed usage information about any runnables above that provide it.`

export const RUNNABLE_MODULE_USAGE_HEADER = `${chalk.bold('Usage:')} node [ENTRY_DIRECTORY_NAME] ${chalk.bold('[NAME]')} [options]`

export const INDENT = '  '

export const NO_RUNNABLES_RESOLVED_MESSAGE = 'No runnables found.'

export const UNRESOLVED_RUNNABLE_ERROR_MESSAGE = `Runnable ${chalk.bold('[NAME]')} could not be resolved.`
