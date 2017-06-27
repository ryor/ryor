const {parseCommandLineInput} = require('../input')

test('Parses command line input', () =>
{
  expect(parseCommandLineInput(['arg'])).toEqual([['arg']])
  expect(parseCommandLineInput(['more', 'than', 'one', 'arg'])).toEqual([['more', 'than', 'one', 'arg']])
  expect(parseCommandLineInput(['one', 'definition', '+', 'another', 'definition'])).toEqual([['one', 'definition'], ['another', 'definition']])
})
