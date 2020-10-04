import { bold } from 'chalk'
import { HEADER } from '../../source/composeMainUsageInformation'

module.exports = {

  all:

`${HEADER}

${bold('Tasks:')}

  ${bold('build')}         No description provided
  ${bold('deploy')}        Deploys project
  ${bold('test')}          Tests project

${bold('Tools:')}

  ${bold('bundler')}       No description provided
  ${bold('tester')}        Tests code
  ${bold('transpiler')}    Transpiles code

${bold('Other:')}

  ${bold('git')}           Runs preconfigured Git commands
  ${bold('npm')}           Runs preconfigured NPM commands`,

  'all-sorted':

`${HEADER}

${bold('Tools:')}

  ${bold('bundler')}       No description provided
  ${bold('tester')}        Tests code
  ${bold('transpiler')}    Transpiles code

${bold('Tasks:')}

  ${bold('build')}         No description provided
  ${bold('deploy')}        Deploys project
  ${bold('test')}          Tests project

${bold('Other:')}

  ${bold('git')}           Runs preconfigured Git commands
  ${bold('npm')}           Runs preconfigured NPM commands`,

  'only-tools':

`${HEADER}

${bold('Tools:')}

  ${bold('bundler')}       No description provided
  ${bold('tester')}        Tests code
  ${bold('transpiler')}    Transpiles code`,

  'only-untyped':

`${HEADER}

${bold('build')}     No description provided
${bold('deploy')}    Deploys project
${bold('test')}      Tests project`

}
