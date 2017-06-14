const {transpile} = require('typescript')

module.exports = {
  process: function(source, path)
  {
    if (path.endsWith('.ts'))
      return transpile(source, {module:'CommonJS', target:'ES2017'}, path, [])

    return source
  }
}
