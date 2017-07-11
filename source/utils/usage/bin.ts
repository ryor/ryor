import {bold} from 'chalk'
import {existsSync, readdirSync} from 'fs'
import {EOL} from 'os'
import {parse, resolve} from 'path'
import {resolveAllRunnableModules} from '../modules'
import {composeUsageInformationList} from './lists'

export const COMMAND_FLAG:string = '-c  --command'
export const COMMAND_FLAG_DESCRIPTION:string = `Skips runnable resolution. Executables that share a name with a runnable are indicated with a ${bold('*')} below.`
export const BIN_USAGE_INFORMATION_HEADER:string = `${bold('Usage:')} node run [flag] ${bold('<executable>')} [args...]`
export const NO_BIN_DIRECTORY_FOUND_MESSAGE:string = `No ${bold('node_modules/.bin')} directory found`
export const NO_BIN_FILES_FOUND_MESSAGE:string = `The ${bold('node_modules/.bin')} directory is empty`

export function composeBinUsageInformation():string
{
  const nodeModulesDirectoryPath:string = resolve(process.cwd(), 'node_modules')
  const nodeModulesBinDirectoryPath:string = resolve(nodeModulesDirectoryPath, '.bin')

  if (!existsSync(nodeModulesBinDirectoryPath))
    return NO_BIN_DIRECTORY_FOUND_MESSAGE

  const files:string[] = readdirSync(nodeModulesBinDirectoryPath)

  if (files.length === 0)
    return NO_BIN_FILES_FOUND_MESSAGE

  const modules:Map<string, Map<string, RunnableModule>> = resolveAllRunnableModules()
  const descriptions:Map<string, string|undefined> = new Map<string, string|undefined>()
  const runnableNames:Set<string> = new Set<string>()
  let minNameLength:number = COMMAND_FLAG.length
  let maskedNamesCount:number = 0

  modules.forEach((typeModules:Map<string, RunnableModule>, type:string):void =>
  {
    typeModules.forEach(({description, usage}:RunnableModule, name:string):void =>
    {
      runnableNames.add(name)
    })
  })

  files.forEach((file:string):void =>
  {
    let name:string = parse(file).name

    if (!descriptions.has(name))
    {
      const packageJSONPath:string = resolve(nodeModulesDirectoryPath, name, 'package.json')
      let description:string|undefined

      if (existsSync(packageJSONPath))
      {
        const packageJSON:{description?:string} = require(packageJSONPath) as {description?:string}

        if (packageJSON.description !== undefined && packageJSON.description.length > 0)
          description = packageJSON.description

        if (runnableNames.has(name))
        {
          name = `${name}*`
          maskedNamesCount++
        }
      }

      descriptions.set(name, description)

      if (name.length > minNameLength)
        minNameLength = name.length
    }
  })

  return [BIN_USAGE_INFORMATION_HEADER]
    .concat(maskedNamesCount > 0 ? [composeUsageInformationList(new Map<string, string|undefined>([[COMMAND_FLAG, COMMAND_FLAG_DESCRIPTION]]), 'flag', minNameLength)] : [])
    .concat([composeUsageInformationList(descriptions, `command${descriptions.size > 1 ? 's' : ''}`, minNameLength)])
    .join(`${EOL}${EOL}`)
}
