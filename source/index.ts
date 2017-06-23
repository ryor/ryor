import {existsSync} from 'fs'
import {resolve} from 'path'
import Runner from './Runner'
import {outputUsageInformation} from './utils/usage'

export function run(args:string[] = []):void
{
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
    const binDirectoryPath:string = resolve(process.cwd(), 'node_modules/.bin')

    if (existsSync(binDirectoryPath))
        process.env.PATH = `${process.env.PATH}${process.platform === 'win32' ? ';' : ':'}${binDirectoryPath}`

    new Runner(definitions).run()
  }

  else
    outputUsageInformation()
}
