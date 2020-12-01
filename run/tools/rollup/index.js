export const description = 'Bundles ES modules produced by TypeScript into single CommonJS module with Rollup'

export const args = {
  quiet: {
    alias: 'q',
    description: 'No output unless errors are encountered by Rollup'
  }
}

export const run = ({ quiet }) => {
  const sequence = []

  if (!quiet) sequence.push('log -w Bundling module with Rollup')

  sequence.push(
    'rollup -c run/tools/rollup/config.js --silent',
    'shx rm -rf build/node_modules'
  )

  return sequence
}
