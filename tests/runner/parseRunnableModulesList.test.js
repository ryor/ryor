import {
  DUPLICATE_RUNNABLE_MODULE_NAME_ERROR_MESSAGE,
  INVALID_RUNNABLE_MODULES_LIST_ERROR_MESSAGE,
  INVALID_RUNNABLE_MODULES_LIST_ITEM_ERROR_MESSAGE
} from '../../source/runner/constants'
import { parseRunnableModulesList } from '../../source/runner/parseRunnableModulesList'

describe('Parse runnable modules list', () => {
  test('with no input', () => {
    expect(parseRunnableModulesList()).toEqual([])
  })

  test('with empty array', () => {
    expect(parseRunnableModulesList([])).toEqual([])
  })

  test('with only string values', () => {
    expect(parseRunnableModulesList(['build', 'develop'])).toEqual([['build'], ['develop']])
  })

  test('with only category arrays', () => {
    expect(
      parseRunnableModulesList([
        ['main', ['build', 'develop']],
        ['tools', ['rollup', 'jest']],
        ['utils', 'upgrade']
      ])
    ).toEqual([
      ['build', 'main'],
      ['develop', 'main'],
      ['rollup', 'tools'],
      ['jest', 'tools'],
      ['upgrade', 'utils']
    ])
  })

  test('with mix of string values and category arrays', () => {
    // prettier-ignore
    expect(
      parseRunnableModulesList([
        'status',
        ['main', ['build', 'develop']],
        ['tools', ['rollup', 'jest']],
        ['utils', 'upgrade'],
        'test'
      ])
    ).toEqual([
      ['status'],
      ['build', 'main'],
      ['develop', 'main'],
      ['rollup', 'tools'],
      ['jest', 'tools'],
      ['upgrade', 'utils'],
      ['test']
    ])
  })

  test('with invalid list item values', () => {
    expect(() => parseRunnableModulesList(0)).toThrow(INVALID_RUNNABLE_MODULES_LIST_ERROR_MESSAGE.replace('[VALUE]', '0'))
    expect(() => parseRunnableModulesList(true)).toThrow(INVALID_RUNNABLE_MODULES_LIST_ERROR_MESSAGE.replace('[VALUE]', 'true'))
    expect(() => parseRunnableModulesList([0])).toThrow(INVALID_RUNNABLE_MODULES_LIST_ITEM_ERROR_MESSAGE.replace('[VALUE]', '0'))
    expect(() => parseRunnableModulesList([true])).toThrow(INVALID_RUNNABLE_MODULES_LIST_ITEM_ERROR_MESSAGE.replace('[VALUE]', 'true'))
    expect(() => parseRunnableModulesList([['build']])).toThrow(INVALID_RUNNABLE_MODULES_LIST_ITEM_ERROR_MESSAGE.replace('[VALUE]', '["build"]'))
    expect(() => parseRunnableModulesList([['main', 0]])).toThrow(INVALID_RUNNABLE_MODULES_LIST_ITEM_ERROR_MESSAGE.replace('[VALUE]', '["main",0]'))
  })

  test('with duplicate runnable names', () => {
    expect(() => parseRunnableModulesList(['build', 'build'])).toThrow(DUPLICATE_RUNNABLE_MODULE_NAME_ERROR_MESSAGE.replace('[VALUE]', '"build"'))
    expect(() => parseRunnableModulesList(['build', ['main', 'build']])).toThrow(
      DUPLICATE_RUNNABLE_MODULE_NAME_ERROR_MESSAGE.replace('[VALUE]', '["main","build"]')
    )
  })
})
