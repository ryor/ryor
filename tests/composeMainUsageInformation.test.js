/* eslint-env jest */

import { bold } from 'chalk'
import { resolve } from 'path'
import { FOOTER, HEADER, NO_RUNNABLES_RESOLVED_MESSAGE, composeMainUsageInformation } from '../source/composeMainUsageInformation'
import expectedMainUsageInformation from './test-projects/expectedMainUsageInformation'

describe('Confirm constant values:', () => {
  test('FOOTER', () => expect(FOOTER).toBe(`Use ${bold('node [ENTRY_DIRECTORY_NAME] help <runnable>')} for detailed usage information about any runnables above that provide it.`))
  test('HEADER', () => expect(HEADER).toBe(`${bold('Usage:')} node [ENTRY_DIRECTORY_NAME] [option] <runnable> [args...] [+ <runnable> [args...]] ...`))
  test('NO_RUNNABLES_RESOLVED_MESSAGE', () => expect(NO_RUNNABLES_RESOLVED_MESSAGE).toBe('No runnables found.'))
})

describe('Compose main usage information', () => {
  test('returns NO_RUNNABLES_RESOLVED_MESSAGE when no valid runnables are resolved', async () => {
    let configuration

    process.chdir(resolve(__dirname, 'test-projects/empty-runnables-directory'))
    configuration = { entry: { directoryName: 'run', directoryPath: resolve(__dirname, 'test-projects/empty-runnables-directory/run') } }
    expect(await composeMainUsageInformation(configuration)).toBe(NO_RUNNABLES_RESOLVED_MESSAGE)

    process.chdir(resolve(__dirname, 'test-projects/invalid-definitions'))
    configuration = { entry: { directoryName: 'run', directoryPath: resolve(__dirname, 'test-projects/invalid-definitions/run') } }
    expect(await composeMainUsageInformation(configuration)).toBe(NO_RUNNABLES_RESOLVED_MESSAGE)

    process.chdir(resolve(__dirname, 'test-projects/syntax-error'))
    configuration = { entry: { directoryName: 'run', directoryPath: resolve(__dirname, 'test-projects/syntax-error/run') } }
    expect(await composeMainUsageInformation(configuration)).toBe(NO_RUNNABLES_RESOLVED_MESSAGE)
  })

  test('for "only-untyped" test project', async () => {
    const configuration = { entry: { directoryName: 'run', directoryPath: resolve(__dirname, 'test-projects/only-untyped/run') } }

    process.chdir(resolve(__dirname, 'test-projects/only-untyped'))
    expect(await composeMainUsageInformation(configuration)).toBe(expectedMainUsageInformation['only-untyped'])
  })

  test('for "only-tools" test project', async () => {
    const configuration = { entry: { directoryName: 'run', directoryPath: resolve(__dirname, 'test-projects/only-tools/run') } }

    process.chdir(resolve(__dirname, 'test-projects/only-tools'))
    expect(await composeMainUsageInformation(configuration)).toBe(expectedMainUsageInformation['only-tools'])
  })

  test('for "all" test project', async () => {
    const configuration = { entry: { directoryName: 'run', directoryPath: resolve(__dirname, 'test-projects/all/run') } }

    process.chdir(resolve(__dirname, 'test-projects/all'))

    expect(await composeMainUsageInformation(configuration)).toBe(expectedMainUsageInformation.all)
    expect(await composeMainUsageInformation({ ...configuration, usage: { types: { order: ['tools'] } } })).toBe(expectedMainUsageInformation['all-sorted'])
    expect(await composeMainUsageInformation({ ...configuration, usage: { types: { order: ['tools', 'tasks'] } } })).toBe(expectedMainUsageInformation['all-sorted'])
    expect(await composeMainUsageInformation({ ...configuration, usage: { types: { order: ['foo', 'tools'] } } })).toBe(expectedMainUsageInformation['all-sorted'])
    expect(await composeMainUsageInformation({ ...configuration, usage: { types: { order: ['foo', 'tools', 'foo2', 'tasks'] } } })).toBe(expectedMainUsageInformation['all-sorted'])
  })
})
