export function commaSeparateValues(values:string[]):string
{
  return values.join(', ').replace(/,(?=[^,]*$)/, ' and')
}

export function maxStringLength(strings:string[]):number
{
  return strings.reduce((maxLength:number, string:string):number => string.length > maxLength ? string.length : maxLength, 0)
}

export function padStringWithSpaces(string:string, minLength:number):string
{
  while (string.length < minLength)
    string += ' '

  return string
}
