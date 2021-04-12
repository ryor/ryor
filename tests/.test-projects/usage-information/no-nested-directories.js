import { bold } from 'chalk'
import { DEFAULT_ITEM_DESCRIPTION, MAIN_USAGE_FOOTER, MAIN_USAGE_HEADER, RUNNABLE_USAGE_HEADER } from '../../../source/usage/constants'
import { LINE_BREAK } from '../../../source/shared/constants'

const DOUBLE_LINE_BREAK = LINE_BREAK + LINE_BREAK

export let main = `${MAIN_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks')}

${bold('build')}     ${DEFAULT_ITEM_DESCRIPTION}
${bold('deploy')}    Deploys project
${bold('test')}      Tests project

${MAIN_USAGE_FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks')}`

export let build = RUNNABLE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks').replace('[NAME]', 'build')

export let deploy = [RUNNABLE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks').replace('[NAME]', 'deploy'), 'Deploys project'].join(DOUBLE_LINE_BREAK)

export let test = [RUNNABLE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks').replace('[NAME]', 'test'), 'Tests project'].join(DOUBLE_LINE_BREAK)
