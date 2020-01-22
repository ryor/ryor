import { EOL } from 'os'

export function handleError (error:Error|string):void {
  if (error instanceof SyntaxError) console.error(`${EOL}${error.stack}${EOL}`)

  else if (error instanceof Error) console.error(`${EOL}${error.message}${EOL}`)

  else console.error(`${EOL}${error}${EOL}`)

  process.exit(1)
}
