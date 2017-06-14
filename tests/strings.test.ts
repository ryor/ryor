import {bold} from 'chalk'
import {resolve} from 'path'
import {commaSeparateValues, maxStringLength, padStringWithSpaces} from '../source/strings'

test('Outputs grammatically correct comma-separated value strings', ():void =>
{
  expect(commaSeparateValues(['One'])).toBe('One')
  expect(commaSeparateValues(['One', 'Two'])).toBe('One and Two')
  expect(commaSeparateValues(['One', 'Two', 'Three'])).toBe('One, Two and Three')
  expect(commaSeparateValues(['One', 'Two', 'Three', 'Four'])).toBe('One, Two, Three and Four')
})

test('Determines max length of strings in array', () =>
{
  expect(maxStringLength([''])).toBe(0)
  expect(maxStringLength([' '])).toBe(1)
  expect(maxStringLength(['', ' '])).toBe(1)
  expect(maxStringLength(['one', 'two'])).toBe(3)
  expect(maxStringLength(['one', 'two', 'three'])).toBe(5)
  expect(maxStringLength(['this', 'is', 'a', 'bunch', 'of', 'strings'])).toBe(7)
})

test('Pads strings with spaces to minimum length', () =>
{
  expect(padStringWithSpaces('', 1)).toBe(' ')
  expect(padStringWithSpaces(' ', 1)).toBe(' ')
  expect(padStringWithSpaces('  ', 1)).toBe('  ')
  expect(padStringWithSpaces(' ', 5)).toBe('     ')
})
