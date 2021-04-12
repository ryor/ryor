/* eslint-env jest */

import { DEFAULT_PATH_DIVIDER, DEBUG_OPTION_FLAG, RUN_TIME_OPTION_FLAG, RUN_TIME_TEMPLATE, WINDOWS_PATH_DIVIDER } from '../../source/runner/constants'

describe('Verify constant values', () => {
  test('DEFAULT_PATH_DIVIDER', () => expect(DEFAULT_PATH_DIVIDER).toBe(':'))
  test('DEBUG_OPTION_FLAG', () => expect(DEBUG_OPTION_FLAG).toBe('debug'))
  test('RUN_TIME_OPTION_FLAG', () => expect(RUN_TIME_OPTION_FLAG).toBe('time'))
  test('RUN_TIME_TEMPLATE', () => expect(RUN_TIME_TEMPLATE).toBe('Completed in [RUN_TIME]ms.'))
  test('WINDOWS_PATH_DIVIDER', () => expect(WINDOWS_PATH_DIVIDER).toBe(';'))
})
