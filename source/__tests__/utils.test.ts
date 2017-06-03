import {commaSeparateValues, fail, maxStringLength, padStringWithSpaces} from '../utils'

test('Outputs neatly comma-separated value strings', ():void =>
{
  expect(commaSeparateValues(['One'])).toBe('One')
  expect(commaSeparateValues(['One', 'Two'])).toBe('One and Two')
  expect(commaSeparateValues(['One', 'Two', 'Three'])).toBe('One, Two and Three')
  expect(commaSeparateValues(['One', 'Two', 'Three', 'Four'])).toBe('One, Two, Three and Four')
})

test('Determines max length of strings in array', ():void =>
{
  expect(maxStringLength([''])).toBe(0)
  expect(maxStringLength([' '])).toBe(1)
  expect(maxStringLength(['', ' '])).toBe(1)
  expect(maxStringLength(['one', 'two'])).toBe(3)
  expect(maxStringLength(['one', 'two', 'three'])).toBe(5)
  expect(maxStringLength(['this', 'is', 'a', 'bunch', 'of', 'strings'])).toBe(7)
})

test('Pads strings with spaces to minimum length', ():void =>
{
  expect(padStringWithSpaces('', 1)).toBe(' ')
  expect(padStringWithSpaces(' ', 1)).toBe(' ')
  expect(padStringWithSpaces('  ', 1)).toBe('  ')
  expect(padStringWithSpaces(' ', 5)).toBe('     ')
})

test('Fails with and without a message', ():void =>
{
  let message:string = ''
  let exitCode:number = 0

  jest.spyOn(console, 'error').mockImplementation((value:string):string => message = value)
  jest.spyOn(process, 'exit').mockImplementation((code:number):number => exitCode = code)

  fail()

  expect(message).toBe('')
  expect(exitCode).toBe(1)

  exitCode = 0

  fail('This is a message')

  expect(message.includes('This is a message')).toBe(true)
  expect(exitCode).toBe(1)
})
