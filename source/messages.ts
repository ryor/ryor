import {bold} from 'chalk'

export const COMMAND_NOT_FOUND:string = `No ${bold('[COMMAND_NAME]')} command found. Create one in ${bold('run/commands')} to proceed.`

export const COMMAND_DEFINITION_NOT_FOUND:string = `No ${bold('define')} function or ${bold('nps')} script key exported by ${bold('[COMMAND_PATH]')}.`

export const COMMAND_VALUES_COUNT_TOO_HIGH:string = `Command ${bold('[COMMAND_NAME]')} takes only [LIMIT] [TYPE] for ${bold('[KEY]')}.[RECEIVED]`

export const COMMAND_VALUES_COUNT_TOO_LOW:string = `Command ${bold('[COMMAND_NAME]')} requires [REQUIRED] [TYPE] for ${bold('[KEY]')}.[RECEIVED]`

export const COMMAND_VALUES_INVALID:string = `Command ${bold('[COMMAND_NAME]')} accepts the following ${bold('[KEY]')} values: [VALUES]. Received [RECEIVED].`

export const COMMAND_VALUES_KEY_MISSING:string = `No ${bold('key')} value found in values definition in ${bold('[COMMAND_PATH]')}.`

export const HELP_USAGE:string = `${bold('Usage:')} node run <command> [options] [values...]`

export const HELP_TIP:string = `Use ${bold('`node run help <command>`')} for more information about a command. Usage information for the ${bold('nps')} command lists available NPS scripts.`

export const NPS_SCRIPT_NOT_FOUND:string = `NPS script ${bold('[SCRIPT_NAME]')} not found.`

export const NO_DESCRIPTION_PROVIDED:string = 'No description provided'
