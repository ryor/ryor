export const args = {
  quiet: {
    alias: 'q',
    boolean: true,
    description: 'Stays quiet'
  }
}

export const description = () => 'Transpiles code'

export const run =
  ({ quiet }) =>
  () =>
    console.log(`Transpiling${quiet ? ' quietly' : ''}`)
