const {transpile} = require('typescript')

module.exports = {
  process: function(source, path)
  {
    if (path.endsWith('.ts'))
      return transpile(source, {}, path)

    return source
  }
}
