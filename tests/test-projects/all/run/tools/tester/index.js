export const args = {
  coverage: {
    alias: 'c',
    boolean: true,
    description: 'Includes coverage results'
  }
}

export const description = 'Tests code'

export const run = ({ coverage }) => console.log(`Testing with${coverage ? '' : 'out'} coverage results`)
