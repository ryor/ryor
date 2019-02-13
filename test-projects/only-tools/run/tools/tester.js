function run (args) {
  return args.length > 0 && args[0] === 'coverage' ? 'testing with coverage results' : 'testing without coverage results'
}

module.exports = { run }
