const { ERROR_TEMPLATE, HEADER_TEMPLATE } = require('../source/composeRunnableUsageInformation')

describe('Confirm constant values:', () => {
  const { bold } = require('chalk')

  test('ERROR_TEMPLATE', () => expect(ERROR_TEMPLATE).toBe(`Runnable ${bold('[NAME]')} could not be resolved.`))
  test('HEADER_TEMPLATE', () => expect(HEADER_TEMPLATE).toBe(`${bold('Usage:')} node run ${bold('[NAME]')}`))
})

describe('Compose runnable usage information', () => {
  const { EOL } = require('os')
  const { resolve } = require('path')
  const { composeRunnableUsageInformation } = require('../source/composeRunnableUsageInformation')

  test('throws Error when runnable module cannot be resolved', async () => {
    const name = 'unresolvable'

    try {
      await composeRunnableUsageInformation(name)
    } catch (error) {
      expect(error.message).toBe(ERROR_TEMPLATE.replace('[NAME]', name))
    }
  })

  test('throws Error when runnable module contains syntax error', async () => {
    process.chdir(resolve(__dirname, 'test-projects/syntax-error'))

    try {
      await composeRunnableUsageInformation('bundler')
    } catch (error) {
      expect(error.name).toBe('SyntaxError')
    }
  })

  test('throws errors when runnable modules are invalid', async () => {
    const { INVALID_RUNNABLE_ERROR_TEMPLATE, NO_RUNNABLE_ERROR_TEMPLATE } = require('../source/requireRunnableModule')
    const projectDirectoryPath = resolve(__dirname, 'test-projects/invalid-definitions')
    let name, path

    process.chdir(projectDirectoryPath)

    name = 'bundler'
    path = require.resolve(resolve(projectDirectoryPath, 'run', name)).replace(projectDirectoryPath, '.')

    try {
      await composeRunnableUsageInformation(name)
    } catch (error) {
      expect(error.message).toBe(NO_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', path))
    }

    name = 'tester'
    path = require.resolve(resolve(projectDirectoryPath, 'run', name)).replace(projectDirectoryPath, '.')

    try {
      await composeRunnableUsageInformation(name)
    } catch (error) {
      expect(error.message).toBe(INVALID_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', path))
    }

    name = 'transpiler'
    path = require.resolve(resolve(projectDirectoryPath, 'run', name)).replace(projectDirectoryPath, '.')

    try {
      await composeRunnableUsageInformation(name)
    } catch (error) {
      expect(error.message).toBe(INVALID_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', path))
    }
  })

  test('for runnables in "only-untyped" test project', async () => {
    let name

    process.chdir(resolve(__dirname, 'test-projects/only-untyped'))

    name = 'build'
    expect(await composeRunnableUsageInformation(name)).toBe(HEADER_TEMPLATE.replace('[NAME]', name))

    name = 'deploy'
    expect(await composeRunnableUsageInformation(name)).toBe([HEADER_TEMPLATE.replace('[NAME]', name), 'Deploys project'].join(EOL+EOL))

    name = 'test'
    expect(await composeRunnableUsageInformation(name)).toBe([HEADER_TEMPLATE.replace('[NAME]', name), 'Tests project'].join(EOL+EOL))
  })

  test('for runnables in "only-tools" test project', async () => {
    const usage = '-q  --quiet  Stays quiet.'
    let name

    process.chdir(resolve(__dirname, 'test-projects/only-tools'))

    name = 'bundler'
    expect(await composeRunnableUsageInformation(name)).toBe([HEADER_TEMPLATE.replace('[NAME]', name), usage].join(EOL+EOL))

    name = 'tester'
    expect(await composeRunnableUsageInformation(name)).toBe([HEADER_TEMPLATE.replace('[NAME]', name), 'Tests code', usage].join(EOL+EOL))

    name = 'transpiler'
    expect(await composeRunnableUsageInformation(name)).toBe([HEADER_TEMPLATE.replace('[NAME]', name), 'Transpiles code', usage].join(EOL+EOL))
  })

  test('for runnables in "all" test project', async () => {
    let name, expectedResult

    process.chdir(resolve(__dirname, 'test-projects/all'))

    name = 'git'
    expectedResult = [`${HEADER_TEMPLATE.replace('[NAME]', name)} <command>`, 'Runs preconfigured Git commands', '-c  --commit  Commits code'].join(EOL+EOL)
    expect(await composeRunnableUsageInformation(name)).toBe(expectedResult)

    name = 'bundler'
    expectedResult = [`${HEADER_TEMPLATE.replace('[NAME]', name)} [options]`, '-q  --quit  Stays quiet.'].join(EOL+EOL)
    expect(await composeRunnableUsageInformation(name)).toBe(expectedResult)

    name = 'transpiler'
    expectedResult = [HEADER_TEMPLATE.replace('[NAME]', name), 'Transpiles code', '-q  --quit  Stays quiet.'].join(EOL+EOL)
    expect(await composeRunnableUsageInformation(name)).toBe(expectedResult)

    name = 'tester'
    expectedResult = [`${HEADER_TEMPLATE.replace('[NAME]', name)} (with Jest!)`, 'Tests code'].join(EOL+EOL)
    expect(await composeRunnableUsageInformation(name)).toBe(expectedResult)
  })
})
