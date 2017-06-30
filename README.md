## Roll Your Own (Task) Runner for Node.js Projects

[![Travis](https://img.shields.io/travis/ryor/ryor.svg)](https://travis-ci.org/ryor/ryor/branches)
[![Codecov](https://img.shields.io/codecov/c/github/ryor/ryor.svg)](https://codecov.io/gh/ryor/ryor)
[![Greenkeeper](https://badges.greenkeeper.io/ryor/ryor.svg)](https://greenkeeper.io/)
[![David-DM dependencies](https://david-dm.org/ryor/ryor/master.svg)](https://david-dm.org/ryor/ryor/master)
[![David-DM devDependencies](https://david-dm.org/ryor/ryor/dev-status.svg)](https://david-dm.org/ryor/ryor/master#info=devDependencies)
[![License](https://img.shields.io/github/license/ryor/ryor.svg)](https://github.com/ryor/ryor/blob/master/LICENSE)

### No system dependencies

Including **[ryor](https://www.npmjs.com/package/ryor)** as a project development dependency is all that's needed to get started.

### No plugins

Unlike task runners or pluggable build tools that require often clunky coordination between unevenly maintained 3rd-party plugins (Gulp, Grunt, Webpack, etc.), **ryor** exposes the tools that already [do one thing and do it well](https://en.wikipedia.org/wiki/Unix_philosophy) as CLIs or Node APIs and offers a convenient and robust means of writing custom "runnables".

### Less clutter

Instead of cluttering of a project's root directory and/or package.json file with configuration files/details, runnables can be neatly self-contained.

### Sequences

Similar to shell, npm/yarn or [NPS](https://www.npmjs.com/package/nps) scripts, sequences can be composed that utilize runnables, either run in series or parallel.  If runnables defined as functions/Promises return sequences themselves, those operations are then run as well.

### Simple to define

Runnables can be defined in two subdirectories in a project's `run` directory, `tasks` and `tools`. Tasks are intended to be the main developer interface for a project, composing sequences that utilize other runnables. Tools are intended to be either "batteries included" versions of tools included as project dependencies, with all of the configuration details required to run properly, or functions/Promises that perform any necessary operations.  Runnables can also included an optional description, which is displayed in the usage information.

### Simple to get usage information

```node run```

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
