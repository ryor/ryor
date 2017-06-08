module.exports = {
  description: 'Bundles ES modules produced by TypeScript into single CommonJS module with Rollup',
  nps: 'rollup -e chalk,crypto,fs,nps,os,path -f cjs -o build/index.js build/esm/index.js'
}
