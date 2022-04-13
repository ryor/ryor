import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'build/.esm/index.js',
  output: {
    file: 'build/index.js',
    format: 'es',
    paths: {
      'terminate/promise': 'terminate/promise.js'
    }
  },
  external: ['chalk', 'cli-truncate', 'cross-spawn', 'minimist', 'ps-tree', 'shell-quote'],
  plugins: [
    nodeResolve({ preferBuiltins: true })
  ]
}
