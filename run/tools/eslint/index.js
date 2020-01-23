'use strict'

module.exports = {
  description: 'Checks source TypeScript and runnables JavaScript for errors with ESLint',
  usage: require('../../utils/usage').composeUsageInformation([[
    '-s  --source', 'Check source TypeScipt for errors',
    '-r  --runnables', 'Check runnables JavaScript for errors',
    '-f  --fix', 'Fix errors that can be handled automatically by ESlist',
    '-q  --quiet', 'No output unless errors are encountered'
  ]]),
  run: args => {
    const { fix, quiet, runnables, source } = require('minimist')(args, {
      alias: { f: 'fix', q: 'quiet', r: 'runnables', s: 'source' },
      boolean: ['f', 'fix', 'q', 'quiet', 'r', 'runnables', 's', 'source']
    })
    const both = !runnables && !source
    const sequence = []

    if (both || source) {
      if (!quiet) sequence.push(`log -w Checking for${fix ? ' and fixing ' : ' '}errors in source TypeScript with ESLint`)

      sequence.push(`eslint -c run/tools/eslint/config.source.yml source --ext .js,.ts${fix ? ' --fix' : ''}`)
    }

    if (both || runnables) {
      if (!quiet) sequence.push(`log -w Checking for${fix ? ' and fixing ' : ' '}errors in runnables JavaScript with ESLint`)

      sequence.push(`eslint -c run/tools/eslint/config.run.yml run${fix ? ' --fix' : ''}`)
    }

    return sequence
  }
}
