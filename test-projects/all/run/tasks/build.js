const description = 'Builds project'

function run (args) {
  return args.length > 0 && args[0] === 'production' ? 'echo running production build' : 'echo running development build'
}

module.exports = { description, run }
