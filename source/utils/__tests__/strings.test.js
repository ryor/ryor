const {capitalize, maxStringLength, padStringWithSpaces} = require('../strings')

test('Capitalizes string', () =>
{
  expect(capitalize('value')).toBe('Value')
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
