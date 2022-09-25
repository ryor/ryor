export const description = 'Transpiles TypeScript and bundles ES modules into single minified CommonJS module with Rollup and Terser'

export const args = {
  development: {
    alias: 'd',
    description: 'Development build (skips minification)'
  },
  quiet: {
    alias: 'q',
    description: 'No output unless errors are encountered by tools'
  }
}

export const run = async ({ development, quiet }) => {
  const { readFileSync, writeFileSync } = await import('fs')
  const sequence = [
    'shx rm -rf build',
    `esbuild${quiet ? ' -q' : ''}`,
    [
      '-c',
      () => {
        const packageJSON = JSON.parse(readFileSync('package.json').toString())

        packageJSON.exports = './index.js'

        delete packageJSON.devDependencies

        writeFileSync('build/package.json', JSON.stringify(packageJSON, null, '  '))
      },
      'shx cp README.md build',
      'shx rm -rf build/.esm build/node_modules'
    ]
  ]

  if (!development) sequence.push(`terser${quiet ? ' -q' : ''}`)

  if (!quiet) sequence.push('log -s Build complete')

  return sequence
}
