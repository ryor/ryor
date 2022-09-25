export const run = (args) => {
  const sequence = []

  if (args.length > 0 && args[0] === '-p') sequence.push('tester')

  sequence.push('builder')

  return sequence
}
