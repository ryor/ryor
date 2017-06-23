import {red} from 'chalk'
import {EOL} from 'os'
import Resolver from './Resolver'
import Runner from './Runner'

export function run(args:string[] = []):void
{
  const resolver = new Resolver()

  if (args.length > 0)
  {
    const definitions:string[][] = args
      .reduce((definitions:string[][], arg:string):string[][] =>
      {
        if (arg === '+')
          definitions.push([])

        else
          definitions[definitions.length - 1].push(arg)

        return definitions
      }, [[]])
      .filter((definition:RunnableDefinition):boolean => (definition as string[]).length > 0)

    new Runner(definitions, resolver).run()
      .catch((error) =>
      {
        if (error)
          console.error(`${EOL}${red(error.message || error)}${EOL}`)

        process.exit(1)
      })
  }

  else
    console.log(`${EOL}${resolver.composeUsageInformation()}${EOL}`)
}
