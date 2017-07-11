## Roll Your Own (Task) Runner for Node.js Projects

[![Circle CI](https://circleci.com/gh/ryor/ryor.svg?&style=shield)](https://circleci.com/gh/ryor/ryor)
[![Codecov](https://img.shields.io/codecov/c/github/ryor/ryor.svg)](https://codecov.io/gh/ryor/ryor)
[![David-DM dependencies](https://david-dm.org/ryor/ryor/master.svg)](https://david-dm.org/ryor/ryor/master)
[![David-DM devDependencies](https://david-dm.org/ryor/ryor/dev-status.svg)](https://david-dm.org/ryor/ryor/master#info=devDependencies)
[![License](https://img.shields.io/github/license/ryor/ryor.svg)](https://github.com/ryor/ryor/blob/master/LICENSE)

### No system dependencies

Including **[ryor](https://www.npmjs.com/package/ryor)** as a project development dependency is all that's needed to get started.

### No plugins

Unlike task runners or pluggable build tools that require often clunky coordination between unevenly maintained 3rd-party plugins (Gulp, Grunt, Webpack, etc.), **ryor** offers a convenient means of using the tools that already [do one thing and do it well](https://en.wikipedia.org/wiki/Unix_philosophy) as CLIs or Node APIs.

### Less clutter

Instead of cluttering of a project's root directory and/or package.json file with configuration files/details, runnables can be neatly self-contained.

### Sequences

Similar to shell, npm/yarn or [NPS](https://www.npmjs.com/package/nps) scripts, sequences can be composed that run in series or parallel.

### Simple to get usage information

```node run```

or

```node run help```

### Simple to use

```node run <runnable> [...args]```

or

```node run <runnable> [...args] + <runnable> [...args] + <runnable> [...args]```

### Templates

[Node module with TypeScript, TSLint, Jest and Rollup](https://github.com/ryor/ryor-simple-module-template)<br>
[Node CLI module with TypeScript, TSLint, Jest and Rollup](https://github.com/ryor/ryor-cli-module-template)<br>
[Static generated Preact SPA with TypeScript, TSLint and Rollup](https://github.com/ryor/ryor-static-gen-spa-preact-template)

### Utility

[Command-line utility for initializing projects from ryor templates](https://github.com/ryor/ryor-init)

### Documentation

Coming soon.
