import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'build/.esm/index.js',
  output: {
    file: 'build/index.js',
    format: 'es'
  },
  external: ['chalk', 'cli-truncate', 'cross-spawn', 'esm', 'minimist', 'shell-quote'],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    {
      renderChunk: code => {
        if (code.includes("import { bold } from 'chalk';")) {
          code = code.replace(
            "import { bold } from 'chalk';",
            "import chalk from 'chalk';\nconst { bold } = chalk;"
          )
        }

        return code
      }
    }
  ]
}
