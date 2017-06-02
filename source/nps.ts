import {existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync} from 'fs'
import nps from 'nps'
import {EOL, tmpdir} from 'os'
import {parse, resolve} from 'path'
import {NO_DESCRIPTION_PROVIDED} from './messages'

export function getNPSScriptDescriptions(parentNode:NPSScriptsConfiguration = getNPSConfiguration().scripts, parentPath:string = ''):NPSScriptDescriptions
{
  return Object.keys(parentNode)
    .filter((key:string):boolean => !key.startsWith('_'))
    .reduce((descriptions:NPSScriptDescriptions, key:string):NPSScriptDescriptions =>
    {
      if (!['description', 'default', 'script'].includes(key))
      {
        const node:NPSScriptsConfiguration = parentNode[key] as NPSScriptsConfiguration
        const scriptPath:string = `${parentPath}${key}`
        let description:string|undefined
        let script:string|undefined

        if (typeof node === 'string')
          script = node

        else if (node.description)
          description = node.description as string

        else if (node.default)
        {
          if (typeof node.default === 'string')
            script = node.default as string

          else if ((node.default as NPSScriptsConfiguration).description)
            description = (node.default as NPSScriptsConfiguration).description as string

          else if ((node.default as NPSScriptsConfiguration).script)
            script = (node.default as NPSScriptsConfiguration).script as string
        }

        else if (node.script)
          script = node.script as string

        if (description !== undefined)
          descriptions[scriptPath] = description

        else if (script !== undefined)
          descriptions[scriptPath] = NO_DESCRIPTION_PROVIDED

        if (typeof node === 'object')
          Object.assign(descriptions, getNPSScriptDescriptions(node, `${scriptPath}.`))
      }

      return descriptions
    }, {})
}

export function getNPSScriptDescription(scriptName:string):string
{
  const descriptions:NPSScriptDescriptions = getNPSScriptDescriptions()

  return descriptions[scriptName] || NO_DESCRIPTION_PROVIDED
}

export function getNPSConfiguration():NPSConfiguration
{
  const scriptsDirectoryPath:string = resolve(process.cwd(), 'run/nps-scripts')
  const config:NPSConfiguration = {scripts:{}}

  readdirSync(scriptsDirectoryPath)
    .filter((fsPath:string):boolean => fsPath.endsWith('.js') || fsPath.endsWith('.json'))
    .map((scriptPath:string):string => parse(scriptPath).name)
    .forEach((scriptName:string):NPSScriptsConfiguration => config.scripts[scriptName] = require(resolve(scriptsDirectoryPath, scriptName)))

  return config
}

export function runNPSScripts(scripts:string[], debug:boolean = false):void
{
  const configDirectoryPath:string = resolve(tmpdir(), 'ryor')
  const configFilePath:string = resolve(configDirectoryPath, `${Date.now()}.json`)
  const config:NPSConfiguration = JSON.parse(JSON.stringify(getNPSConfiguration()).replace(/nps /g, `nps -sc ${configFilePath} `))
  const scriptConfig:NPSScriptsConfiguration = config.scripts

  if (!existsSync(configDirectoryPath))
    mkdirSync(configDirectoryPath)

  writeFileSync(configFilePath, JSON.stringify(config, null, 2))

  nps({scriptConfig, scripts, options: {silent: true}})
    .then(():void => unlinkSync(configFilePath))
    .catch(({message}:NPSError):void =>
    {
      unlinkSync(configFilePath)

      if (debug)
        console.error(`${message}${EOL}`)
    })
}
