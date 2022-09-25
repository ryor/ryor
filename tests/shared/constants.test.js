import { LINE_BREAK, WINDOWS_IDENTIFIER } from '../../source/shared/constants'

describe('Verify constant values', () => {
  test('LINE_BREAK', () => expect(LINE_BREAK).toBe('\n'))
  test('WINDOWS_IDENTIFIER', () => expect(WINDOWS_IDENTIFIER).toBe('win32'))
})
