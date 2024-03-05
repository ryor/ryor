import ryor from 'ryor'

// prettier-ignore
ryor([
  ['main', ['build', 'develop', 'publish', 'test']],
  ['tools', ['esbuild', 'eslint', 'jest', 'prettier', 'terser']],
  ['version-control', ['branch', 'commit', 'merge', 'release']],
  ['utilities', ['log', 'update']]
])
