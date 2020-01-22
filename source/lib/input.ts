export function parseCommandLineInput (input:string[]):string[][] {
  return input
    .reduce(
      (definitions:string[][], value:string):string[][] => {
        if (value === '+') { definitions.push([]) } else { definitions[definitions.length - 1].push(value) }

        return definitions
      },
      [[]]
    )
    .filter((definition:string[]):boolean => definition.length > 0)
}
