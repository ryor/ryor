/* eslint-env jest */

import { bold } from 'chalk'
import { EOL } from 'os'
import { resolve } from 'path'
import { ERROR_TEMPLATE, HEADER_TEMPLATE, composeRunnableUsageInformation } from '../source/composeRunnableUsageInformation'
import { configure } from '../source/configure'

describe('Confirm constant values:', () => {
  test('ERROR_TEMPLATE', () => expect(ERROR_TEMPLATE).toBe(`Runnable ${bold('[NAME]')} could not be resolved.`))
  test('HEADER_TEMPLATE', () => expect(HEADER_TEMPLATE).toBe(`${bold('Usage:')} node [ENTRY_DIRECTORY_NAME] ${bold('[NAME]')}`))
})

describe('Compose runnable usage information', () => {
  const EOL2 = EOL + EOL

  test('throws Error when runnable module cannot be resolved', async () => {
    const configuration = await configure(['node', resolve(process.cwd(), 'run')])
    const name = 'unresolvable'

    try {
      await composeRunnableUsageInformation(name, configuration)
    } catch (error) {
      expect(error.message).toBe(ERROR_TEMPLATE.replace('[NAME]', name))
    }
  })

  test('throws Error when runnable module can\'t be resolved', async () => {
    let configuration, projectDirectoryPath, runnableName

    projectDirectoryPath = resolve(__dirname, 'test-projects/syntax-error')
    configuration = await configure(['node', resolve(projectDirectoryPath, 'run')])
    runnableName = 'bundler'

    process.chdir(projectDirectoryPath)

    try {
      await composeRunnableUsageInformation(runnableName, configuration)
    } catch (error) {
      expect(error.message).toBe(ERROR_TEMPLATE.replace('[NAME]', runnableName))
    }

    projectDirectoryPath = resolve(__dirname, 'test-projects/invalid-definitions')
    configuration = await configure(['node', resolve(projectDirectoryPath, 'run')])

    process.chdir(projectDirectoryPath)

    try {
      await composeRunnableUsageInformation(runnableName, configuration)
    } catch (error) {
      expect(error.message).toBe(ERROR_TEMPLATE.replace('[NAME]', runnableName))
    }

    runnableName = 'linter'

    try {
      await composeRunnableUsageInformation(runnableName, configuration)
    } catch (error) {
      expect(error.message).toBe(ERROR_TEMPLATE.replace('[NAME]', runnableName))
    }

    runnableName = 'tester'

    try {
      await composeRunnableUsageInformation(runnableName, configuration)
    } catch (error) {
      expect(error.message).toBe(ERROR_TEMPLATE.replace('[NAME]', runnableName))
    }

    runnableName = 'transpiler'

    try {
      await composeRunnableUsageInformation(runnableName, configuration)
    } catch (error) {
      expect(error.message).toBe(ERROR_TEMPLATE.replace('[NAME]', runnableName))
    }
  })

  test('for runnables in "only-untyped" test project', async () => {
    const projectDirectoryPath = resolve(__dirname, 'test-projects/only-untyped')
    const configuration = await configure(['node', resolve(projectDirectoryPath, 'run')])
    let name

    process.chdir(projectDirectoryPath)

    name = 'build'
    expect(await composeRunnableUsageInformation(name, configuration)).toBe(HEADER_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', name))

    name = 'deploy'
    expect(await composeRunnableUsageInformation(name, configuration)).toBe([HEADER_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', name), 'Deploys project'].join(EOL2))

    name = 'test'
    expect(await composeRunnableUsageInformation(name, configuration)).toBe([HEADER_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', name), 'Tests project'].join(EOL2))
  })

  test('for runnables in "only-tools" test project', async () => {
    process.chdir(resolve(__dirname, 'test-projects/only-tools'))

    const configuration = await configure(['node', resolve(process.cwd(), 'run')])
    const usage = '-q  --quiet  Stays quiet'
    let name

    name = 'bundler'
    expect(await composeRunnableUsageInformation(name, configuration)).toBe([`${HEADER_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', name)} [options]`, usage].join(EOL2))

    name = 'tester'
    expect(await composeRunnableUsageInformation(name, configuration)).toBe([`${HEADER_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', name)} [options]`, 'Tests code', usage].join(EOL2))

    name = 'transpiler'
    expect(await composeRunnableUsageInformation(name, configuration)).toBe([HEADER_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', name), 'Transpiles code'].join(EOL2))
  })

  test('for runnables in "all" test project', async () => {
    process.chdir(resolve(__dirname, 'test-projects/all'))

    const configuration = await configure(['node', resolve(process.cwd(), 'run')])
    let name, expectedResult

    name = 'git'
    expectedResult = [`${HEADER_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', name)} [options]`, 'Runs preconfigured Git commands', '-c  --commit  Commits code'].join(EOL2)
    expect(await composeRunnableUsageInformation(name, configuration)).toBe(expectedResult)

    name = 'bundler'
    expectedResult = [`${HEADER_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', name)} [options]`, '-q  --quiet  Stays quiet'].join(EOL2)
    expect(await composeRunnableUsageInformation(name, configuration)).toBe(expectedResult)

    name = 'transpiler'
    expectedResult = [`${HEADER_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', name)} [options]`, 'Transpiles code', '-q  --quiet  Stays quiet'].join(EOL2)
    expect(await composeRunnableUsageInformation(name, configuration)).toBe(expectedResult)

    name = 'tester'
    expectedResult = [`${HEADER_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', name)} [options]`, 'Tests code', '-c  --coverage  Includes coverage results'].join(EOL2)
    expect(await composeRunnableUsageInformation(name, configuration)).toBe(expectedResult)
  })
})
