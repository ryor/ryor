function task(message)
{
  return `chalk -t "{cyan ⏳} {bold ${message}}"`
}

function success(message)
{
  return `chalk -t "{cyan ✓} {bold ${message}}"`
}

module.exports = {success, task}
