export function capitalize(value:string):string
{
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

export function commaSeperateStrings(values:string[]):string
{
  const seperator:string = ', '
  let output:string = values.join(seperator)

  if (output.includes(seperator))
    output = `${output.slice(0, output.lastIndexOf(seperator))} or ${output.slice(output.lastIndexOf(seperator) + seperator.length)}`

  return output
}

export function maxStringLength(strings:string[]):number
{
  return strings.reduce((maxLength:number, value:string):number => value.length > maxLength ? value.length : maxLength, 0)
}

export function padStringWithSpaces(value:string, minLength:number):string
{
  while (value.length < minLength)
    value += ' '

  return value
}
