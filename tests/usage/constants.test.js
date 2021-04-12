/* eslint-env jest */

import { bold } from 'chalk'
import {
  DEFAULT_ITEM_DESCRIPTION,
  INDENT,
  MAIN_USAGE_FOOTER,
  MAIN_USAGE_HEADER,
  NO_RUNNABLES_RESOLVED_MESSAGE,
  RUNNABLE_USAGE_HEADER,
  UNRESOLVED_RUNNABLE_ERROR_MESSAGE
} from '../../source/usage/constants'

describe('Verify constant values', () => {
  test('DEFAULT_ITEM_DESCRIPTION', () => expect(DEFAULT_ITEM_DESCRIPTION).toBe('No description provided'))
  test('INDENT', () => expect(INDENT).toBe('  '))
  test('MAIN_USAGE_FOOTER', () => expect(MAIN_USAGE_FOOTER).toBe(`Use ${bold('node [ENTRY_DIRECTORY_NAME] help <runnable>')} for detailed usage information about any runnables above that provide it.`))
  test('MAIN_USAGE_HEADER', () => expect(MAIN_USAGE_HEADER).toBe(`${bold('Usage:')} node [ENTRY_DIRECTORY_NAME] [option] <runnable> [args...] [+ <runnable> [args...]] ...`))
  test('NO_RUNNABLES_RESOLVED_MESSAGE', () => expect(NO_RUNNABLES_RESOLVED_MESSAGE).toBe('No runnables found.'))
  test('RUNNABLE_USAGE_HEADER', () => expect(RUNNABLE_USAGE_HEADER).toBe(`${bold('Usage:')} node [ENTRY_DIRECTORY_NAME] ${bold('[NAME]')}`))
  test('UNRESOLVED_RUNNABLE_ERROR_MESSAGE', () => expect(UNRESOLVED_RUNNABLE_ERROR_MESSAGE).toBe(`Runnable ${bold('[NAME]')} could not be resolved.`))
})
