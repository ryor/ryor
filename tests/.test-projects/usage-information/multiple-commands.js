import { bold } from 'chalk'
import { LINE_BREAK } from '../../../source/shared/constants'
import { RUNNABLE_MODULE_USAGE_HEADER } from '../../../source/usage/constants'

const DOUBLE_LINE_BREAK = LINE_BREAK + LINE_BREAK

export const gitflow = [
  `${RUNNABLE_MODULE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'gitflow')} <command>`,
  'Runs Gitflow-esque Git commands',
  'Commands:',
  `  ${bold('branch')}  Creates feature or release branches`,
  `    ${bold('-f  --feature')}  Creates feature branch${LINE_BREAK}` +
  `    ${bold('-r  --release')}  Creates release branch`,
  `  ${bold('merge')}   Merges current feature or release branch into develop or main branches respectively`
].join(DOUBLE_LINE_BREAK)
