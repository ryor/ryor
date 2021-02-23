/* eslint-env jest */

import { INVALID_RUNNABLE_MODULE_ERROR_MESSAGE } from '../../source/modules/constants'

describe('Verify constant values', () => {
  test('INVALID_RUNNABLE_MODULE_ERROR_MESSAGE', () => expect(INVALID_RUNNABLE_MODULE_ERROR_MESSAGE).toBe('Invalid runnable module: [MODULE_PATH]'))
})
