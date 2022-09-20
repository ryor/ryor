import chalk from 'chalk'
import { LINE_BREAK } from '../../../source/shared/constants'
import { DEFAULT_ITEM_DESCRIPTION, MAIN_USAGE_FOOTER, MAIN_USAGE_HEADER, RUNNABLE_MODULE_USAGE_HEADER } from '../../../source/usage/constants'

const DOUBLE_LINE_BREAK = LINE_BREAK + LINE_BREAK
const { bold } = chalk

export const main = `${MAIN_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks')}

${bold('build')}     ${DEFAULT_ITEM_DESCRIPTION}
${bold('deploy')}    Deploys project
${bold('test')}      Tests project

${MAIN_USAGE_FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks')}`

export const build = [
  `${RUNNABLE_MODULE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks').replace('[NAME]', 'build')}`,
  `${bold('-h  --help')}  Displays this usage information`
].join(DOUBLE_LINE_BREAK)

export const deploy = [
  `${RUNNABLE_MODULE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks').replace('[NAME]', 'deploy')}`,
  'Deploys project',
  `${bold('-h  --help')}  Displays this usage information`
].join(DOUBLE_LINE_BREAK)

export const test = [
  `${RUNNABLE_MODULE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks').replace('[NAME]', 'test')}`,
  'Tests project',
  `${bold('-h  --help')}  Displays this usage information`
].join(DOUBLE_LINE_BREAK)
