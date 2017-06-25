export function parseCommandLineInput(input:string[]):RunnableDefinition[]
{
  return input
    .reduce((definitions:RunnableDefinition[], value:string):RunnableDefinition[] =>
    {
      if (value === '+')
        definitions.push([])

      else
        (definitions[definitions.length - 1] as string[]).push(value)

      return definitions
    }, [[]])
    .filter((definition:RunnableDefinition):boolean => definition.length > 0)
}
