export function define():CommandDefinition
{
  const description:string = 'Outputs usage information'

  const values:CommandValuesDefinition = {
    key: 'command',
    description: 'A specific command',
    limit: 1
  }

  return {description, values}
}

export function run({command}:HelpCommandArguments):void
{
  require('../ryor').outputHelpMessage(command)
}
