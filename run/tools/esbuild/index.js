export const description = 'Builds module with esbuild'

export const args = {
  quiet: {
    alias: 'q',
    description: 'No output unless errors are encountered'
  }
}

export async function run ({ quiet }) {
  const sequence = []

  if (!quiet) sequence.push('log -w Bundling module with esbuild...')

  sequence.push([
    'esbuild source/index.ts',
    '--bundle',
    ...['chalk', 'cli-truncate', 'cross-spawn', 'minimist', 'shell-quote', 'terminate'].map(value => `--external:${value}`),
    '--format=esm',
    '--log-level=error',
    '--outfile=build/index.js',
    '--platform=node',
    '--tsconfig=./run/tools/esbuild/tsconfig.json'
  ].join(' '))

  return sequence
}
