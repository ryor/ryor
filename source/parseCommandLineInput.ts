import type { RunnableSequence } from './types'

export function parseCommandLineInput (args:string[]):RunnableSequence {
  return args
    .reduce((definitions:string[][], value:string):string[][] => {
      if (value === '+') definitions.push([])

      else definitions[definitions.length - 1].push(value)

      return definitions
    }, [[]])
    .filter((definition:string[]):boolean => definition.length > 0)
    .map((array:string[]):string => array.join(' '))
}
