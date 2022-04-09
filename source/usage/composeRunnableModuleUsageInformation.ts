import chalk from 'chalk'
import { basename } from 'path'
import { ensureRunnableModuleHelpArgumentDefinition, resolveRunnableModule } from '../modules'
import { RunnableError } from '../runnables'
import { LINE_BREAK, isPopulatedObject } from '../shared'
import { composeRunnableArgumentsInformation } from './composeRunnableArgumentsInformation'
import { composeRunnableDescription } from './composeRunnableDescription'
import { INDENT, RUNNABLE_MODULE_USAGE_HEADER, UNRESOLVED_RUNNABLE_ERROR_MESSAGE } from './constants'
import type { RunnableModule, RunnableModuleCommandDefinition } from '../modules'
import type { RunnerConfiguration } from '../runner'

export async function composeRunnableModuleUsageInformation (name: string, configuration: RunnerConfiguration): Promise<string> {
  const module: RunnableModule | undefined = await resolveRunnableModule(name, configuration)

  if (module === undefined) throw new RunnableError(UNRESOLVED_RUNNABLE_ERROR_MESSAGE.replace('[NAME]', name))

  const description: string | undefined = composeRunnableDescription(module)
  let header: string = RUNNABLE_MODULE_USAGE_HEADER.replace('[ENTRY_DIRECTORY_NAME]', basename(configuration.directory)).replace('[NAME]', name)
  let body: string | undefined

  if (module.commands !== undefined && isPopulatedObject(module.commands)) {
    const { commands }: RunnableModule = module
    const names: string[] = Object.keys(commands).sort((a: string, b: string): number => a.localeCompare(b))
    const maxNameLength: number = names.reduce((result: number, name: string): number => name.length > result ? name.length : result, 0)

    header += ' <command>'

    body = 'Commands:' +
      LINE_BREAK + LINE_BREAK +
      names.map((name: string): string[] => {
        const definition: RunnableModuleCommandDefinition = commands[name]
        const description: string = definition.description ?? ''
        const options: string = definition.args !== undefined && isPopulatedObject(definition.args) ? composeRunnableArgumentsInformation(definition.args, INDENT + INDENT) : ''

        return [name, description, options]
      })
        .map(([name, description, options]: string[]): string => {
          return `${INDENT}${chalk.bold(name)}${' '.repeat(maxNameLength - name.length)}${description !== '' ? `${INDENT + description}` : ''}${options !== '' ? `${LINE_BREAK + LINE_BREAK + options}` : ''}`
        })
        .join(LINE_BREAK + LINE_BREAK)
  } else body = composeRunnableArgumentsInformation(ensureRunnableModuleHelpArgumentDefinition(module.args))

  return [header]
    .concat(description ?? [])
    .concat(body ?? [])
    .join(LINE_BREAK + LINE_BREAK)
}
