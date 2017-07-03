import {bold} from 'chalk'
import {existsSync, readdirSync} from 'fs'
import {EOL} from 'os'
import {parse, resolve} from 'path'
import {resolveAllRunnableModules, resolveRunnableModule} from './modules'
import {capitalize, commaSeperateStrings, maxStringLength, padStringWithSpaces} from './strings'

export const DEFAULT_DESCRIPTION:string = 'No description provided'
export const DEFAULT_RUNNABLE_INFORMATION_HEADER:string = `${bold('Usage:')} node run [NAME]`
export const MAIN_USAGE_INFORMATION_HEADER:string = `${bold('Usage:')} node run <runnable> [args...] [+ <runnable> [args...]] ...`
export const NO_RUNNABLES_RESOLVED_MESSAGE:string = `No runnables found.`
export const USAGE_RUNNABLE_DESCRIPTION:string = 'Outputs usage information. Specify [NAMES] for detailed information about [DETERMINER] runnables.'
export const USAGE_RUNNABLE_NAME:string = 'help'

export function composeUsageDetailsList(items:Map<string, string>|Array<[string, string]>, type?:string, maxNameLength?:number):string
{
  if (Array.isArray(items))
    items = new Map<string, string>(items)

  const lines:string[] = type !== undefined && type !== '' ? [`${bold(`${capitalize(type)}:`)}${EOL}`] : []
  const indent:string = type !== undefined && type !== '' ? '  ' : ''

  if (maxNameLength === undefined)
    maxNameLength = maxStringLength(Array.from(items.keys()))

  items.forEach((description:string, name:string):number => lines.push(`${indent}${bold(padStringWithSpaces(name, maxNameLength!))}    ${description}`))

  return lines.join(`${EOL}`)
}

export function composeMainUsageInformation():string
{
  const modules:Map<string, Map<string, RunnableModule>> = resolveAllRunnableModules()
  const sections:Map<string, Map<string, string>> = new Map<string, Map<string, string>>()
  const runnableKeys:Set<string> = new Set<string>()
  const runnablesWithUsageKeys:Set<string> = new Set<string>()
  const nodeModulesDirectoryPath:string = resolve(process.cwd(), 'node_modules')
  const nodeModulesBinDirectoryPath:string = resolve(nodeModulesDirectoryPath, '.bin')
  const header:string = MAIN_USAGE_INFORMATION_HEADER
  let section:Map<string, string>
  let maxKeyLength:number = 0
  let body:string = ''

  modules.forEach((typeModules:Map<string, RunnableModule>, type:string):void =>
  {
    section = new Map<string, string>()

    typeModules.forEach(({description, usage}:RunnableModule, key:string):void =>
    {
      runnableKeys.add(key)

      if (key.length > maxKeyLength)
        maxKeyLength = key.length

      if (typeof description === 'function')
        description = description()

      if (usage !== undefined)
      {
        runnablesWithUsageKeys.add(key)

        description = `${description !== undefined ? `${description}${description.endsWith('.') ? '' : '.'} ` : ''}Use ${bold.underline(`node run help ${key}`)} for detailed usage information.`
      }

      section.set(key, description !== undefined ? description : DEFAULT_DESCRIPTION)
    })

    sections.set(type, section)
  })

  section = new Map<string, string>()

  if (existsSync(nodeModulesBinDirectoryPath))
    readdirSync(nodeModulesBinDirectoryPath).forEach((fileName:string):void =>
    {
      const key:string = parse(fileName).name

      if (!runnableKeys.has(key))
      {
        const packageJSONPath:string = resolve(nodeModulesDirectoryPath, key, 'package.json')
        let description:string = DEFAULT_DESCRIPTION

        if (existsSync(packageJSONPath))
        {
          const packageJSON:{description?:string} = require(packageJSONPath) as {description?:string}

          if (packageJSON.description !== undefined && packageJSON.description.length > 0)
            description = packageJSON.description
        }

        section.set(key, description)

        if (key.length > maxKeyLength)
          maxKeyLength = key.length
      }
    })

  if (runnablesWithUsageKeys.size > 0)
    section.set(
      USAGE_RUNNABLE_NAME,
      USAGE_RUNNABLE_DESCRIPTION
        .replace('[NAMES]', commaSeperateStrings(Array.from(runnablesWithUsageKeys.keys()).sort().map((key:string):string => bold(`${key}`))))
        .replace('[DETERMINER]', runnablesWithUsageKeys.size === 1 ? 'that' : 'those')
    )

  if (sections.size > 0)
  {
    const lists:string[] = []

    if (section.size > 0)
      sections.set('Also available', section)

    sections.forEach((map:Map<string, string>, type:string):number => lists.push(composeUsageDetailsList(map, type, maxKeyLength)))

    body = lists.join(`${EOL}${EOL}`)
  }

  else if (section.size > 0)
    body = composeUsageDetailsList(section, undefined, maxKeyLength)

  else
    return NO_RUNNABLES_RESOLVED_MESSAGE

  return `${header}${EOL}${EOL}${body}`
}

export function composeRunnableUsageInformation(name:string):string
{
  const runnableModule:RunnableModule|undefined = resolveRunnableModule(name)
  let header:string = DEFAULT_RUNNABLE_INFORMATION_HEADER.replace('[NAME]', bold(name))
  let description:string = DEFAULT_DESCRIPTION
  let body:string = ''

  if (runnableModule !== undefined)
  {
    let {usage}:RunnableModule = runnableModule

    if (runnableModule.description !== undefined)
      description = typeof runnableModule.description === 'function' ? runnableModule.description() : runnableModule.description

    if (usage !== undefined)
    {
      if (typeof usage === 'function')
        usage = usage()

      if (typeof usage === 'string')
        body = usage

      else
      {
        if (usage.args !== undefined)
          header += ` ${usage.args}`

        if (usage.body !== undefined)
          body = usage.body
      }
    }
  }

  return [header, description].concat(body !== '' ? [body] : []).join(`${EOL}${EOL}`)
}

export function composeUsageInformation(name?:string):string
{
  if (name !== undefined)
  {
    const runnableModule:RunnableModule|undefined = resolveRunnableModule(name)

    if (runnableModule !== undefined && runnableModule.usage !== undefined)
      return composeRunnableUsageInformation(name)
  }

  return composeMainUsageInformation()
}
