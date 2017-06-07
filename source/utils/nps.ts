import {randomBytes} from 'crypto'
import {existsSync, mkdirSync, unlinkSync, writeFileSync} from 'fs'
import {tmpdir} from 'os'
import nps from 'nps'
import {resolve} from 'path'
import {bold} from 'chalk'
import {getRunnables} from './runnables'
import {Message, commaSeparateValues} from './strings'

export function getNPSScripts():NPSScripts
{
  const tasks:Map<string, Runnable>|undefined = getRunnables('tasks')
  const tools:Map<string, Runnable>|undefined = getRunnables('tools')
  const scripts:NPSScripts = {}

  if (tasks)
    tasks.forEach(({nps}:Runnable, key) =>
    {
      if (nps)
        scripts[key] = nps
    })

  if (tools)
    tools.forEach(({nps}:Runnable, key) =>
    {
      if (nps)
        scripts[key] = nps
    })

  return scripts
}

export function getNPSScriptNames(parentNode:NPSScripts = getNPSScripts(), parentName:string = ''):string[]
{
  return Object.keys(parentNode)
    .reduce((names:string[], key:string):string[] =>
    {
      if (!['description', 'default', 'script'].includes(key))
      {
        const node:NPSScripts = parentNode[key] as NPSScripts
        const name:string = `${parentName ? `${parentName}.` : ''}${key}`

        if (typeof node === 'string' || node.default || node.script)
          names.push(name)

        if (typeof node === 'object')
          names = names.concat(getNPSScriptNames(node, name))
      }

      return names
    }, [])
}

export function runNPSScripts(scripts:string[]):void
{
  if (scripts.length === 0)
    throw new Error(Message.NPS.ScriptKeysRequired)

  const scriptNames:string[] = getNPSScriptNames()

  if (scriptNames.length === 0)
    throw new Error(Message.NPS.ScriptsNotDefined)

  const unresolvedScripts:string[] = scripts.filter((script:string):boolean => !scriptNames.includes(script))

  if (unresolvedScripts.length > 0)
    throw new Error(
      Message.NPS.ScriptsNotResolved
        .replace('script', unresolvedScripts.length > 1 ? 'scripts' : 'script')
        .replace('[SCRIPTS]', commaSeparateValues(unresolvedScripts.map((script:string):string => bold(script))))
      )

  const configDirectoryPath:string = resolve(tmpdir(), 'ryor')
  const configFilePath:string = resolve(configDirectoryPath, `${randomBytes(10).toString('hex')}.json`)
  const scriptConfig:NPSScripts = JSON.parse(JSON.stringify(getNPSScripts()).replace(/nps /g, `nps -sc ${configFilePath} `))

  if (!existsSync(configDirectoryPath))
    mkdirSync(configDirectoryPath)

  writeFileSync(configFilePath, JSON.stringify({scripts:scriptConfig}))

  nps({scriptConfig, scripts, options: {silent: true}})
    .then(():void => unlinkSync(configFilePath))
    .catch(():void => unlinkSync(configFilePath))
}
