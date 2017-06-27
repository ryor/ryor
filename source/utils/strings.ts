export function capitalize(value:string):string
{
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
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
