const description = 'Tests TypeScript with Jest'

const run = [
  'log -w Testing TypeScript with Jest',
  'echo',
  'jest -c run/tools/jest/config.json',
  'echo',
  'log -s All tests passed'
]

module.exports = {description, run}
