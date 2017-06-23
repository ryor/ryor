import {bold} from 'chalk'
import {readdirSync} from 'fs'
import {EOL} from 'os'
import {parse, resolve} from 'path'
import {getAllModules} from './modules'
import {capitalize, maxStringLength, padStringWithSpaces} from './strings'

export function composeUsageInformation():string
{
  const runnableKeys:Set<string> = new Set<string>()
  const binKeys:Set<string> = new Set<string>()
  let lists:string[] = []

  getAllModules().forEach((typeModules:Map<string, RunnableModule>, type:string):void =>
  {
    const keys:string[] = Array.from(typeModules.keys())
    const maxKeyLength:number = maxStringLength(keys)
    let items:string[] = []

    typeModules.forEach(({description}:RunnableModule, key:string):void =>
    {
      items.push(`  ${bold(padStringWithSpaces(key, maxKeyLength))}    ${description || 'No description provided'}`)
      runnableKeys.add(key)
    })

    lists.push(`${bold(`${capitalize(type)}:`)}${EOL}${EOL}${items.join(EOL)}`)
  })

  readdirSync(resolve(process.cwd(), 'node_modules', '.bin')).forEach((fileName:string):void =>
  {
    const name:string = parse(fileName).name

    if (!runnableKeys.has(name))
      binKeys.add(name)
  })

  if (binKeys.size > 0)
    lists.push(`${bold('bin:')} ${Array.from(binKeys).map((key:string):string => bold(key)).join(' ')}`)

  return `${bold('Usage:')} node run <runnable> [args...] [+ <runnable> [args...]] ...${EOL}${EOL}${lists.join(`${EOL}${EOL}`)}`
}

export function outputUsageInformation():void
{
  console.log(`${EOL}${composeUsageInformation()}${EOL}`)
}
