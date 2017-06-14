import {red} from 'chalk'
import {EOL} from 'os'

export function exit(message?:string)
{
  if (message)
    console.log(`${EOL}${message}${EOL}`)

  process.exit()
}

export function fail(message?:string)
{
  if (message)
    console.error(`${EOL}${red(message)}${EOL}`)

  process.exit(1)
}
