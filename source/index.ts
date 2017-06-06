import {red} from 'chalk'
import {EOL} from 'os'
import {outputHelpMessage} from './utils/help'
import {runNPSScripts} from './utils/nps'

export function run(args:string[] = process.argv.slice(2)):void
{
  if (args.length === 0)
    return outputHelpMessage()

  if (args[0] === 'tools')
    return outputHelpMessage('tools')

  try
  {
    runNPSScripts(args)
  }

  catch(error)
  {
    console.error(`${EOL}${red(error.message || error)}${EOL}`)

    process.exit(1)
  }
}
