import {commaSeparateValues} from '../utils'

test('Outputs neatly comma-separated value strings', ():void =>
{
  expect(commaSeparateValues(['One'])).toBe('One')
  expect(commaSeparateValues(['One', 'Two'])).toBe('One and Two')
  expect(commaSeparateValues(['One', 'Two', 'Three'])).toBe('One, Two and Three')
  expect(commaSeparateValues(['One', 'Two', 'Three', 'Four'])).toBe('One, Two, Three and Four')
})
