const { NO_RUNNABLES_RESOLVED_MESSAGE } = require('../source/composeMainUsageInformation')

describe('Confirm constant values:', () => {
  test('HEADER', () => {
    const { bold } = require('chalk')
    const { HEADER } = require('../source/composeMainUsageInformation')

    expect(HEADER).toBe(`${bold('Usage:')} node run [option] <runnable> [args...] [+ <runnable> [args...]] ...`)
  })

  test('NO_RUNNABLES_RESOLVED_MESSAGE', () => {
    const { NO_RUNNABLES_RESOLVED_MESSAGE } = require('../source/composeMainUsageInformation')

    expect(NO_RUNNABLES_RESOLVED_MESSAGE).toBe('No runnables found.')
  })
})

describe('Compose main usage information', () => {
  const { resolve } = require('path')
  const { composeMainUsageInformation } = require('../source/composeMainUsageInformation')
  const expectedMainUsageInformation = require('./test-projects/expectedMainUsageInformation')

  test('returns NO_RUNNABLES_RESOLVED_MESSAGE when no valid runnables are resolved', async () => {
    process.chdir(resolve(__dirname, 'test-projects/empty'))

    expect(await composeMainUsageInformation()).toBe(NO_RUNNABLES_RESOLVED_MESSAGE)

    process.chdir(resolve(__dirname, 'test-projects/empty-run'))

    expect(await composeMainUsageInformation()).toBe(NO_RUNNABLES_RESOLVED_MESSAGE)

    process.chdir(resolve(__dirname, 'test-projects/invalid-definitions'))

    expect(await composeMainUsageInformation()).toBe(NO_RUNNABLES_RESOLVED_MESSAGE)

    process.chdir(resolve(__dirname, 'test-projects/syntax-error'))

    expect(await composeMainUsageInformation()).toBe(NO_RUNNABLES_RESOLVED_MESSAGE)
  })

  test('for "only-untyped" test project', async () => {
    process.chdir(resolve(__dirname, 'test-projects/only-untyped'))

    expect(await composeMainUsageInformation()).toBe(expectedMainUsageInformation['only-untyped'])
  })

  test('for "only-tools" test project', async () => {
    process.chdir(resolve(__dirname, 'test-projects/only-tools'))

    expect(await composeMainUsageInformation()).toBe(expectedMainUsageInformation['only-tools'])
  })

  test('for "all" test project', async () => {
    process.chdir(resolve(__dirname, 'test-projects/all'))

    expect(await composeMainUsageInformation()).toBe(expectedMainUsageInformation['all'])
    expect(await composeMainUsageInformation({ types: { order: ['tools'] } })).toBe(expectedMainUsageInformation['all-sorted'])
    expect(await composeMainUsageInformation({ types: { order: ['tools', 'tasks'] } })).toBe(expectedMainUsageInformation['all-sorted'])
    expect(await composeMainUsageInformation({ types: { order: ['foo', 'tools'] } })).toBe(expectedMainUsageInformation['all-sorted'])
    expect(await composeMainUsageInformation({ types: { order: ['foo', 'tools', 'foo2', 'tasks'] } })).toBe(expectedMainUsageInformation['all-sorted'])
  })
})
