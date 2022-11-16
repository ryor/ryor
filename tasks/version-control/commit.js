export const description = 'Lints code and, if no errors are encountered, commits all changes to Git repository'

export const args = {
  dirty: {
    alias: 'd',
    description: 'Skips linting',
    type: 'boolean'
  },
  push: {
    alias: 'p',
    description: 'Pushes commit',
    type: 'boolean'
  }
}

export function run({ _, dirty, push }) {
  const sequence = []

  if (!dirty) sequence.push('eslint -f')

  sequence.push('git add --all', `git commit${_.length > 0 ? ` -m "${_.join(' ')}"` : ''}`)

  if (push) sequence.push('git push')

  return sequence
}
