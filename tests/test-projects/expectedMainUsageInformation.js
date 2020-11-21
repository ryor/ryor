import { bold } from 'chalk'
import { FOOTER, HEADER } from '../../source/composeMainUsageInformation'
import { USAGE_TIP_TEMPLATE } from '../../source/composeRunnableDescription'

module.exports = {

  all:

`${HEADER}

${bold('Tasks:')}

  ${bold('build')}         No description provided
  ${bold('deploy')}        Deploys project
  ${bold('test')}          Tests project

${bold('Tools:')}

  ${bold('bundler')}       ${USAGE_TIP_TEMPLATE.replace('[NAME]', 'bundler')}
  ${bold('tester')}        Tests code. ${USAGE_TIP_TEMPLATE.replace('[NAME]', 'tester')}
  ${bold('transpiler')}    Transpiles code. ${USAGE_TIP_TEMPLATE.replace('[NAME]', 'transpiler')}

${bold('Other:')}

  ${bold('git')}           Runs preconfigured Git commands. ${USAGE_TIP_TEMPLATE.replace('[NAME]', 'git')}
  ${bold('npm')}           Runs preconfigured NPM commands. ${USAGE_TIP_TEMPLATE.replace('[NAME]', 'npm')}

${FOOTER}`,

  'all-sorted':

`${HEADER}

${bold('Tools:')}

  ${bold('bundler')}       ${USAGE_TIP_TEMPLATE.replace('[NAME]', 'bundler')}
  ${bold('tester')}        Tests code. ${USAGE_TIP_TEMPLATE.replace('[NAME]', 'tester')}
  ${bold('transpiler')}    Transpiles code. ${USAGE_TIP_TEMPLATE.replace('[NAME]', 'transpiler')}

${bold('Tasks:')}

  ${bold('build')}         No description provided
  ${bold('deploy')}        Deploys project
  ${bold('test')}          Tests project

${bold('Other:')}

  ${bold('git')}           Runs preconfigured Git commands. ${USAGE_TIP_TEMPLATE.replace('[NAME]', 'git')}
  ${bold('npm')}           Runs preconfigured NPM commands. ${USAGE_TIP_TEMPLATE.replace('[NAME]', 'npm')}

${FOOTER}`,

  'only-tools':

`${HEADER}

${bold('Tools:')}

  ${bold('bundler')}       ${USAGE_TIP_TEMPLATE.replace('[NAME]', 'bundler')}
  ${bold('tester')}        Tests code. ${USAGE_TIP_TEMPLATE.replace('[NAME]', 'tester')}
  ${bold('transpiler')}    Transpiles code. ${USAGE_TIP_TEMPLATE.replace('[NAME]', 'transpiler')}

${FOOTER}`,

  'only-untyped':

`${HEADER}

${bold('build')}     No description provided
${bold('deploy')}    Deploys project
${bold('test')}      Tests project

${FOOTER}`

}
