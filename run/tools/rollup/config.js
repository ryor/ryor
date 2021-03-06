import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'build/esm/index.js',
  output: {
    file: 'build/index.js',
    format: 'cjs'
  },
  external: ['chalk', 'cli-truncate', 'cross-spawn', 'esm', 'minimist', 'shell-quote'],
  plugins: [nodeResolve({ preferBuiltins: true })]
}
