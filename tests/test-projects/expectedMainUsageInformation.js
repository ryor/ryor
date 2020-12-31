import { bold } from 'chalk'
import { FOOTER, HEADER } from '../../source/composeMainUsageInformation'
import { USAGE_TIP_TEMPLATE } from '../../source/composeRunnableDescription'

module.exports = {

  all:
    `${HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}

${bold('Tasks:')}

  ${bold('build')}         No description provided
  ${bold('deploy')}        Deploys project
  ${bold('test')}          Tests project

${bold('Tools:')}

  ${bold('bundler')}       ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'bundler')}
  ${bold('tester')}        Tests code. ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'tester')}
  ${bold('transpiler')}    Transpiles code. ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'transpiler')}

${bold('Other:')}

  ${bold('git')}           Runs preconfigured Git commands. ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'git')}
  ${bold('npm')}           Runs preconfigured NPM commands. ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'npm')}

${FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}`,

  'all-sorted':

    `${HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}

${bold('Tools:')}

  ${bold('bundler')}       ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'bundler')}
  ${bold('tester')}        Tests code. ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'tester')}
  ${bold('transpiler')}    Transpiles code. ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'transpiler')}

${bold('Tasks:')}

  ${bold('build')}         No description provided
  ${bold('deploy')}        Deploys project
  ${bold('test')}          Tests project

${bold('Other:')}

  ${bold('git')}           Runs preconfigured Git commands. ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'git')}
  ${bold('npm')}           Runs preconfigured NPM commands. ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'npm')}

${FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}`,

  'only-tools':

    `${HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}

${bold('Tools:')}

  ${bold('bundler')}       ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'bundler')}
  ${bold('tester')}        Tests code. ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', 'tester')}
  ${bold('transpiler')}    Transpiles code

${FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}`,

  'only-untyped':

    `${HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}

${bold('build')}     No description provided
${bold('deploy')}    Deploys project
${bold('test')}      Tests project

${FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}`

}
