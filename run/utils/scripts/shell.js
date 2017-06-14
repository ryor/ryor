function cp(...paths)
{
  return `shx cp -rf ${paths.join(' ')}`
}

function mkdir(...paths)
{
  return `shx mkdir -p ${paths.join(' ')}`
}

function mv(...paths)
{
  return `shx mv ${paths.join(' ')}`
}

function rm(...paths)
{
  return `shx rm -rf ${paths.join(' ')}`
}

function series(...scripts)
{
  return scripts.join(' + ')
}

module.exports = {cp, mkdir, mv, rm, series}
