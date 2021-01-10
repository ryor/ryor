import { bold } from 'chalk'
import { EOL } from 'os'
import { composeRunnableDescription } from './composeRunnableDescription'
import { resolveRunnableModule } from './resolveRunnableModule'
import { RunnableError } from './RunnableError'
import type { Configuration, RunnableModule } from './types'

const ERROR_TEMPLATE: string = `Runnable ${bold('[NAME]')} could not be resolved.`

const HEADER_TEMPLATE: string = `${bold('Usage:')} node [ENTRY_DIRECTORY_NAME] ${bold('[NAME]')}`

const SPACER: string = '  '

export async function composeRunnableUsageInformation (name: string, configuration: Configuration): Promise<string> {
  const { entry }: Configuration = configuration
  const runnableModule: RunnableModule | undefined = await resolveRunnableModule(name, entry.directoryPath)

  if (runnableModule === undefined) throw new RunnableError(ERROR_TEMPLATE.replace('[NAME]', name))

  const description: string | undefined = composeRunnableDescription(runnableModule)
  let header: string = HEADER_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', entry.directoryName).replace('[NAME]', name)
  let body: string | undefined

  if (runnableModule.args !== undefined) {
    const { args }: RunnableModule = runnableModule
    const keys: string[] = Object.keys(args).sort((a: string, b: string): number => a.localeCompare(b))

    if (keys.length > 0) {
      let maxOptionsLength: number = 0

      header += ' [options]'

      body = keys
        .map((key: string): string[] => {
          const short: string = args[key]?.alias !== undefined ? `-${args[key]?.alias as string}` : ''
          const long: string = `--${key}`
          const description: string = args[key]?.description ?? ''
          const optionsLength: number = `${short}${SPACER}${long}`.length

          if (optionsLength > maxOptionsLength) maxOptionsLength = optionsLength

          return [short, long, description]
        })
        .map(([short, long, description]: string[]): string => {
          const options: string = `${short}${SPACER}${long}`

          return `${options}${' '.repeat(maxOptionsLength - options.length)}${description !== '' ? `${SPACER + description}` : ''}`
        })
        .join(EOL)
    }
  }

  return [header]
    .concat(description ?? [])
    .concat(body ?? [])
    .join(EOL + EOL)
}
