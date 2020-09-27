export const description = () => 'Transpiles code'

export const usage = () => ({
  body: '-q  --quit  Stays quiet.'
})

export const run = () => () => console.log('transpiling')
