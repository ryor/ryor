export function define():CommandDefinition
{
  const description:string = 'Runs one or more NPS scripts'

  const options = {
    debug: 'Outputs NPS errors if any are thrown instead of failing silently'
  }

  const values:CommandValuesDefinition = {
    key: 'scripts',
    description: 'One or more NPS scripts to run',
    required: 1,
    limit: Infinity,
    accepts: require('../ryor').getNPSScriptDescriptions()
  }

  return {description, options, values}
}

export function run({debug, scripts}:NPSCommandArguments):void
{
  require('../ryor').runNPSScripts(scripts, debug || false)
}
