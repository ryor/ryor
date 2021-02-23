import { bold } from 'chalk'
import { DEFAULT_ITEM_DESCRIPTION, MAIN_USAGE_FOOTER, MAIN_USAGE_HEADER, RUNNABLE_USAGE_HEADER } from '../../../source/usage/constants'
import { LINE_BREAK } from '../../../source/shared/constants'

const DOUBLE_LINE_BREAK = LINE_BREAK + LINE_BREAK

export let main = `${MAIN_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}

${bold('Tasks:')}

  ${bold('build')}         ${DEFAULT_ITEM_DESCRIPTION}
  ${bold('deploy')}        Deploys project
  ${bold('test')}          Tests project

${bold('Tools:')}

  ${bold('bundler')}       ${DEFAULT_ITEM_DESCRIPTION}
  ${bold('tester')}        Tests code
  ${bold('transpiler')}    Transpiles code

${bold('Other:')}

  ${bold('git')}           Runs preconfigured Git commands
  ${bold('npm')}           Runs preconfigured NPM commands

${MAIN_USAGE_FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}`

export let mainSorted = `${MAIN_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}

${bold('Tools:')}

  ${bold('bundler')}       ${DEFAULT_ITEM_DESCRIPTION}
  ${bold('tester')}        Tests code
  ${bold('transpiler')}    Transpiles code

${bold('Tasks:')}

  ${bold('build')}         ${DEFAULT_ITEM_DESCRIPTION}
  ${bold('deploy')}        Deploys project
  ${bold('test')}          Tests project

${bold('Other:')}

  ${bold('git')}           Runs preconfigured Git commands
  ${bold('npm')}           Runs preconfigured NPM commands

${MAIN_USAGE_FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}`

export let build = `${RUNNABLE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'build')}`

export let bundler = [
  `${RUNNABLE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'bundler')} [options]`,
  `${bold('-q  --quiet')}  Stays quiet`
].join(DOUBLE_LINE_BREAK)

export let tester = [
  `${RUNNABLE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'tester')} [options]`,
  'Tests code',
  `${bold('-c  --coverage')}  Includes coverage results`
].join(DOUBLE_LINE_BREAK)

export let transpiler = [
  `${RUNNABLE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'transpiler')} [options]`,
  'Transpiles code',
  `${bold('-q  --quiet')}  Stays quiet`
].join(DOUBLE_LINE_BREAK)

export let git = [
  `${RUNNABLE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'git')} [options]`,
  'Runs preconfigured Git commands',
  `${bold('-c  --commit')}  Commits code`
].join(DOUBLE_LINE_BREAK)
