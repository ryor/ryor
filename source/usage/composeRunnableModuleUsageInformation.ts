import chalk from 'chalk'
import { basename } from 'path'
import { RunnableModule, RunnableModuleCommandDefinition, ensureRunnableModuleHelpArgumentDefinition, resolveRunnableModule } from '../modules'
import { RunnableError } from '../runnables'
import { RunnerConfiguration } from '../runner'
import { LINE_BREAK, isPopulatedObject } from '../shared'
import { composeRunnableArgumentsInformation } from './composeRunnableArgumentsInformation'
import { composeRunnableDescription } from './composeRunnableDescription'
import { INDENT, RUNNABLE_MODULE_USAGE_HEADER, UNRESOLVED_RUNNABLE_ERROR_MESSAGE } from './constants'

export async function composeRunnableModuleUsageInformation(name: string, configuration: RunnerConfiguration) {
  const module = await resolveRunnableModule(name, configuration)

  if (module === undefined) throw new RunnableError(UNRESOLVED_RUNNABLE_ERROR_MESSAGE.replace('[NAME]', name))

  const description: string | undefined = composeRunnableDescription(module)
  let header: string = RUNNABLE_MODULE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', basename(configuration.directory)).replace('[NAME]', name)
  let body: string | undefined

  if (module.commands !== undefined && isPopulatedObject(module.commands)) {
    const { commands }: RunnableModule = module
    const names: string[] = Object.keys(commands).sort((a: string, b: string) => a.localeCompare(b))
    const maxNameLength: number = names.reduce((result: number, name: string) => (name.length > result ? name.length : result), 0)

    header += ' <command>'

    body =
      'Commands:' +
      LINE_BREAK +
      LINE_BREAK +
      names
        .map((name: string) => {
          const definition: RunnableModuleCommandDefinition = commands[name]
          const description: string = definition.description ?? ''
          const options: string =
            definition.args !== undefined && isPopulatedObject(definition.args) ? composeRunnableArgumentsInformation(definition.args, INDENT + INDENT) : ''

          return [name, description, options]
        })
        .map(([name, description, options]: string[]) => {
          return `${INDENT}${chalk.bold(name)}${' '.repeat(maxNameLength - name.length)}${description !== '' ? `${INDENT + description}` : ''}${
            options !== '' ? `${LINE_BREAK + LINE_BREAK + options}` : ''
          }`
        })
        .join(LINE_BREAK + LINE_BREAK)
  } else body = composeRunnableArgumentsInformation(ensureRunnableModuleHelpArgumentDefinition(module.args))

  return [header]
    .concat(description ?? [])
    .concat(body ?? [])
    .join(LINE_BREAK + LINE_BREAK)
}
