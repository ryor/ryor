const description = 'Transpiles TypeScript into ES modules, bundles ES modules with Rollup and adds autorun function call'

const run = [
  'shx rm -rf build/esm',
  'tsc',
  'rollup',
  'autorun',
  'log -w Cleaning up',
  'shx rm -rf build/esm',
  'log -s Build complete'
]

module.exports = {description, run}
