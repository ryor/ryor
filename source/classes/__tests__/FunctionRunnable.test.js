/* eslint-env jest */
const { FunctionRunnable } = require('../FunctionRunnable')

test('Runs FunctionRunnables', () => {
  function run1 () {
    return 'echo value'
  }

  function run2 () {
    return ['echo value1', 'echo value2']
  }

  function run3 (args) {
    return `echo ${args.join(' ')}`
  }

  function run4 () {}

  const runnables = [
    new FunctionRunnable(run1),
    new FunctionRunnable(run2),
    new FunctionRunnable(run3),
    new FunctionRunnable(run3, ['value1', 'value2']),
    new FunctionRunnable(run4)
  ]

  return Promise.all(runnables.map(runnable => runnable.run())).then(results => {
    expect(results[0]).toBe('echo value')
    expect(results[1]).toEqual(['echo value1', 'echo value2'])
    expect(results[2]).toBe('echo ')
    expect(results[3]).toBe('echo value1 value2')
    expect(results[4]).toBeUndefined()
  })
})
