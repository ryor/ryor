import chalk from 'chalk'
import { LINE_BREAK } from '../../../source/shared/constants'
import { DEFAULT_ITEM_DESCRIPTION, MAIN_USAGE_FOOTER, MAIN_USAGE_HEADER, RUNNABLE_MODULE_USAGE_HEADER } from '../../../source/usage/constants'

const DOUBLE_LINE_BREAK = LINE_BREAK + LINE_BREAK
const { bold } = chalk

export const main = `${MAIN_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks')}

${bold('Main:')}

  ${bold('build')}         Builds

${bold('Tools:')}

  ${bold('bundler')}       ${DEFAULT_ITEM_DESCRIPTION}
  ${bold('tester')}        Tests code
  ${bold('transpiler')}    Transpiles code

${bold('Version Control:')}

  ${bold('commit')}        Commits code

${MAIN_USAGE_FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks')}`

export const bundler = [
  `${RUNNABLE_MODULE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks').replace('[NAME]', 'bundler')}`,
  `${bold('-h  --help')}   Displays this usage information\n${bold('-q  --quiet')}  Stays quiet`
].join(DOUBLE_LINE_BREAK)

export const tester = [
  `${RUNNABLE_MODULE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks').replace('[NAME]', 'tester')}`,
  'Tests code',
  `${bold('-h  --help')}   Displays this usage information\n${bold('-q  --quiet')}  Stays quiet`
].join(DOUBLE_LINE_BREAK)

export const transpiler = [
  RUNNABLE_MODULE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'tasks').replace('[NAME]', 'transpiler'),
  'Transpiles code',
  `${bold('-h  --help')}  Displays this usage information`
].join(DOUBLE_LINE_BREAK)
