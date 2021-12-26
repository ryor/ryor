import chalk from 'chalk'

export const DEFAULT_ITEM_DESCRIPTION: string = 'No description provided'

export const MAIN_USAGE_HEADER: string = `${chalk.bold('Usage:')} node [ENTRY_DIRECTORY_NAME] [option] <runnable> [args...] [+ <runnable> [args...]] ...`

export const MAIN_USAGE_FOOTER: string = `Use ${chalk.bold('node [ENTRY_DIRECTORY_NAME] help <runnable>')} for detailed usage information about any runnables above that provide it.`

export const RUNNABLE_USAGE_HEADER: string = `${chalk.bold('Usage:')} node [ENTRY_DIRECTORY_NAME] ${chalk.bold('[NAME]')}`

export const INDENT: string = '  '

export const NO_RUNNABLES_RESOLVED_MESSAGE: string = 'No runnables found.'

export const UNRESOLVED_RUNNABLE_ERROR_MESSAGE: string = `Runnable ${chalk.bold('[NAME]')} could not be resolved.`
