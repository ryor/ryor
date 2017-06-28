const description = 'Tests TypeScript with Jest'

function run(args)
{
  const minimist = require('minimist')
  const {coverage, verbose} = minimist(args, {
    alias: {c: 'coverage', v: 'verbose'},
    boolean: ['c', 'coverage', 'v', 'verbose']
  })

  return [
    'log -w Testing TypeScript with Jest',
    'echo',
    `jest -c run/tools/jest/config.json${coverage ? ' --coverage' : ''}${verbose ? ' --verbose' : ''}`,
    'echo',
    'log -s All tests passed'
  ]
}

module.exports = {description, run}
