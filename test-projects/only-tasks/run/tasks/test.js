const description = 'Tests project'

const run = [
  'echo running tests',
  [
    'echo running test 1 in parallel',
    'echo running test 2 in parallel',
    'echo running test 3 in parallel',
    'echo running test 4 in parallel'
  ],
  'echo all tests passed successfully'
]

module.exports = {description, run}
