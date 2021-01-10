import { bold } from 'chalk'
import { FOOTER, HEADER } from '../../source/composeMainUsageInformation'
import { DEFAULT_DESCRIPTION } from '../../source/composeUsageInformationList'

let expectedMainUsageInformation = {

  all:

`${HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}

${bold('Tasks:')}

  ${bold('build')}         ${DEFAULT_DESCRIPTION}
  ${bold('deploy')}        Deploys project
  ${bold('test')}          Tests project

${bold('Tools:')}

  ${bold('bundler')}       ${DEFAULT_DESCRIPTION}
  ${bold('tester')}        Tests code
  ${bold('transpiler')}    Transpiles code

${bold('Other:')}

  ${bold('git')}           Runs preconfigured Git commands
  ${bold('npm')}           Runs preconfigured NPM commands

${FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}`,

  'all-sorted':

`${HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}

${bold('Tools:')}

  ${bold('bundler')}       ${DEFAULT_DESCRIPTION}
  ${bold('tester')}        Tests code
  ${bold('transpiler')}    Transpiles code

${bold('Tasks:')}

  ${bold('build')}         ${DEFAULT_DESCRIPTION}
  ${bold('deploy')}        Deploys project
  ${bold('test')}          Tests project

${bold('Other:')}

  ${bold('git')}           Runs preconfigured Git commands
  ${bold('npm')}           Runs preconfigured NPM commands

${FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}`,

  'only-tools':

`${HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}

${bold('Tools:')}

  ${bold('bundler')}       ${DEFAULT_DESCRIPTION}
  ${bold('tester')}        Tests code
  ${bold('transpiler')}    Transpiles code

${FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}`,

  'only-untyped':

`${HEADER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}

${bold('build')}     ${DEFAULT_DESCRIPTION}
${bold('deploy')}    Deploys project
${bold('test')}      Tests project

${FOOTER.replace('[ENTRY_DIRECTORY_NAME]', 'run')}`

}

if (process.platform === 'win32') expectedMainUsageInformation = Object
  .entries(expectedMainUsageInformation)
  .reduce((result, [key, value]) => ({ ...result, [key]: value.replace(/\n/g, '\r\n') }), {})

module.exports = expectedMainUsageInformation
