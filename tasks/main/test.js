export const description = 'Lints runnables, source and tests code with ESlint and unit tests source code with Jest'

export const args = {
  coverage: {
    alias: 'c',
    description: 'Generates Jest coverage results'
  },
  fix: {
    alias: 'f',
    description: 'Fix linting issues that can be handled automatically by ESlint'
  },
  quiet: {
    alias: 'q',
    description: 'No output unless errors are encountered by tools'
  }
}

export const run = ({ coverage, fix, quiet }) => [`eslint${fix ? ' -f' : ''}${quiet ? ' -q' : ''}`, `jest${coverage ? ' -c' : ''}${quiet ? ' -q' : ''}`]
