import {bold} from 'chalk'
import {existsSync, readdirSync} from 'fs'
import {EOL} from 'os'
import {parse, resolve} from 'path'
import {resolveAllRunnableModules} from './modules'
import {capitalize, maxStringLength, padStringWithSpaces} from './strings'

export function composeUsageInformation():string
{
  const modules:Map<string, Map<string, RunnableModule>> = resolveAllRunnableModules()
  const runnableKeys:Set<string> = new Set<string>()
  const binDirectoryPath:string = resolve(process.cwd(), 'node_modules', '.bin')
  const lists:string[] = []

  modules.forEach((typeModules:Map<string, RunnableModule>, type:string):void =>
  {
    const keys:string[] = Array.from(typeModules.keys())
    const maxKeyLength:number = maxStringLength(keys)
    const items:string[] = []

    typeModules.forEach(({description}:RunnableModule, key:string):void =>
    {
      items.push(`  ${bold(padStringWithSpaces(key, maxKeyLength))}    ${description !== undefined ? description : 'No description provided'}`)
      runnableKeys.add(key)
    })

    lists.push(`${bold(`${capitalize(type)}:`)}${EOL}${EOL}${items.join(EOL)}`)
  })

  if (existsSync(binDirectoryPath))
  {
    const binKeys:Set<string> = new Set<string>()

    readdirSync(binDirectoryPath).forEach((fileName:string):void =>
    {
      const name:string = parse(fileName).name

      if (!runnableKeys.has(name))
        binKeys.add(name)
    })

    if (binKeys.size > 0)
      lists.push(bold(`bin: ${Array.from(binKeys).join(' ')}`))
  }

  return `${bold('Usage:')} node run <runnable> [args...] [+ <runnable> [args...]] ...${EOL}${EOL}${lists.join(`${EOL}${EOL}`)}`
}
