const description = 'Transpiles TypeScript into ES modules, bundles ES modules with Rollup and adds autorun function call'

const run = [
  'shx rm -rf build',
  'log -w Transpiling TypeScript',
  'tsc',
  'log -w Bundling module with Rollup',
  'rollup',
  'autorun',
  'log -s Cleaning up',
  'shx rm -rf build/esm',
  'log -s Build complete'
]

module.exports = {description, run}
