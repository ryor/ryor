import { bold } from 'chalk'
import { DEFAULT_ITEM_DESCRIPTION, MAIN_USAGE_FOOTER, MAIN_USAGE_HEADER, RUNNABLE_USAGE_HEADER } from '../../../source/usage/constants'
import { LINE_BREAK } from '../../../source/shared/constants'

const DOUBLE_LINE_BREAK = LINE_BREAK + LINE_BREAK

export let main = `${MAIN_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}

${bold('Tasks:')}

  ${bold('build')}         Builds

${bold('Tools:')}

  ${bold('bundler')}       ${DEFAULT_ITEM_DESCRIPTION}
  ${bold('tester')}        Tests code
  ${bold('transpiler')}    Transpiles code

${bold('Version Control:')}

  ${bold('commit')}        Commits code

${MAIN_USAGE_FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}`

export let bundler = [`${RUNNABLE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'bundler')} [options]`, `${bold('-q  --quiet')}  Stays quiet`].join(DOUBLE_LINE_BREAK)

export let tester = [`${RUNNABLE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'tester')} [options]`, 'Tests code', `${bold('-q  --quiet')}  Stays quiet`].join(DOUBLE_LINE_BREAK)

export let transpiler = [RUNNABLE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'transpiler'), 'Transpiles code'].join(DOUBLE_LINE_BREAK)
