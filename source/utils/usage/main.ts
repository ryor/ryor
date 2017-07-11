import {bold} from 'chalk'
import {existsSync, readdirSync} from 'fs'
import {EOL} from 'os'
import {resolve} from 'path'
import {resolveAllRunnableModules} from '../modules'
import {composeUsageInformationList} from './lists'

export const MAIN_USAGE_INFORMATION_HEADER:string = `${bold('Usage:')} node run [options] <runnable> [args...] [+ [options] <runnable> [args...]] ...`
export const NO_RUNNABLES_RESOLVED_MESSAGE:string = `No runnables found.`
export const USAGE_COMMAND:string = 'help'
export const USAGE_COMMAND_DESCRIPTION:string = `Use ${
  bold('node run help bin')
} to list executables in ${
  bold('node_modules/.bin')
} directory or ${
  bold('node run help <runnable>')
} for detailed usage information about the runnables above that provide it`

export function composeMainUsageInformation():string
{
  const modules:Map<string, Map<string, RunnableModule>> = resolveAllRunnableModules()
  const sections:Map<string, Map<string, string|undefined>> = new Map<string, Map<string, string|undefined>>()
  const runnableKeys:Set<string> = new Set<string>()
  const runnablesWithUsageInformation:Set<string> = new Set<string>()
  const nodeModulesDirectoryPath:string = resolve(process.cwd(), 'node_modules')
  const nodeModulesBinDirectoryPath:string = resolve(nodeModulesDirectoryPath, '.bin')
  const header:string = MAIN_USAGE_INFORMATION_HEADER
  let minKeyLength:number = 0
  let body:string = ''
  let section:Map<string, string|undefined>

  modules.forEach((typeModules:Map<string, RunnableModule>, type:string):void =>
  {
    section = new Map<string, string|undefined>()

    typeModules.forEach(({description, usage}:RunnableModule, key:string):void =>
    {
      runnableKeys.add(key)

      if (key.length > minKeyLength)
        minKeyLength = key.length

      if (typeof description === 'function')
        description = description()

      if (usage !== undefined)
      {
        runnablesWithUsageInformation.add(key)

        description = `${description !== undefined ? `${description}${description.endsWith('.') ? '' : '.'} ` : ''}Use ${bold.underline(`node run help ${key}`)} for detailed usage information.`
      }

      section.set(key, description)
    })

    sections.set(type, section)
  })

  section = new Map<string, string|undefined>()

  if (runnablesWithUsageInformation.size > 0 || (existsSync(nodeModulesBinDirectoryPath) && readdirSync(nodeModulesBinDirectoryPath).length > 0))
  {
    section.set(
      USAGE_COMMAND,
      runnablesWithUsageInformation.size > 0 && (existsSync(nodeModulesBinDirectoryPath) && readdirSync(nodeModulesBinDirectoryPath).length > 0)
            ? USAGE_COMMAND_DESCRIPTION
            : runnablesWithUsageInformation.size > 0
              ? `Use ${USAGE_COMMAND_DESCRIPTION.split('or')[1]}`
              : USAGE_COMMAND_DESCRIPTION.split(' or')[0]
    )
  }

  if (sections.size > 0)
  {
    const lists:string[] = []

    if (section.size > 0)
      sections.set('Also available', section)

    sections.forEach((map:Map<string, string|undefined>, type:string):number => lists.push(composeUsageInformationList(map, type, minKeyLength)))

    body = lists.join(`${EOL}${EOL}`)
  }

  else if (section.size > 0)
  {
    body = composeUsageInformationList(section, undefined, minKeyLength)
  }

  else
    return NO_RUNNABLES_RESOLVED_MESSAGE

  return `${header}${EOL}${EOL}${body}`
}