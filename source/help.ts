import {bold} from 'chalk'
import {EOL} from 'os'
import {HELP_TIP, HELP_USAGE} from './messages'
import {getCommandDefinition, getCommandDescription, getCommandNames, getCommandOptions} from './run'
import {maxStringLength, padStringWithSpaces} from './utils'

export function composeHelpItemsList(label:string, items:HelpItem[]):string
{
  const maxKeyLength:number = maxStringLength(items.map(({key}:HelpItem):string => key))

  return `${bold(`${label}:`)}${EOL}${EOL}  ${items.map(({key, value}:HelpItem, index) => `${padStringWithSpaces(key, maxKeyLength)}    ${value}`).join(`${EOL}  `)}`
}

export function composeMainHelpMessage():string
{
  return [
    HELP_USAGE,
    composeHelpItemsList(
      'Commands',
      getCommandNames()
        .sort((a:string, b:string):number => a === 'help' ? 1 : b === 'help' ? -1 : 0)
        .map((commandName:string):{key:string, value:string} => ({key: bold(commandName), value: getCommandDescription(commandName)}))
    ),
    HELP_TIP
  ].join(`${EOL}${EOL}`)
}

export function composeCommandHelpMessage(commandName:string):string
{
  const {description, values}:CommandDefinition = getCommandDefinition(commandName)!
  const options:CommandOptions = getCommandOptions(commandName)
  const messageParts = [
    HELP_USAGE.replace('<command> [options] [values...]', bold(commandName)),
    description
  ]

  if (Object.keys(options).length > 0)
    messageParts.push(composeHelpItemsList(
      'Options',
      Object.keys(options).map((key:string) =>
      {
        const {alias, description, type}:CommandOption = options[key]

        return {key:`-${alias}  --${key}`, value: `${description}${type === 'string' ? `(${type})` : ''}`}
      })
    ))

  if (values && Object.keys(values).length > 0)
  {
    const {accepts, defaults, description, key, limit, required}:CommandValuesDefinition = values as CommandValuesDefinition
    const brackets = required ? [bold('<'), bold('>')] : ['[', ']']

    messageParts[0] = `${messageParts[0]} ${brackets[0]}${required ? bold(key) : key}${limit && limit > 1 ? '...' : ''}${brackets[1]}`

    messageParts.push(composeHelpItemsList(`Value${limit && limit > 1 ? 's' : ''}`, [{key: `${required ? bold(key) : key}`, value:`${description}${required ? bold(' (required)') : ''}`}]))

    if (accepts)
      messageParts.push(composeHelpItemsList('Accepts', Object.keys(accepts).map(key => ({key: bold(key), value: `${accepts[key]}${defaults && defaults === key ? bold(' (default)') : ''}`}))))
  }

  return messageParts.join(`${EOL}${EOL}`)
}

export function outputHelpMessage(commandName?:string):void
{
  const message:string = commandName && getCommandNames().includes(commandName)
    ? composeCommandHelpMessage(commandName)
    : composeMainHelpMessage()

  console.log(`${EOL}${message}${EOL}`)
}
