## Roll Your Own (Task) Runner for Node.js Projects

[![Travis](https://img.shields.io/travis/ryor-org/ryor.svg)](https://travis-ci.org/ryor-org/ryor/branches)
[![Codecov](https://img.shields.io/codecov/c/github/ryor-org/ryor/v0.1.2.svg)](https://codecov.io/gh/ryor-org/ryor/branch/v0.1.2)
[![Greenkeeper](https://badges.greenkeeper.io/ryor-org/ryor.svg)](https://greenkeeper.io/)
[![David-DM dependencies](https://david-dm.org/ryor-org/ryor/master.svg)](https://david-dm.org/ryor-org/ryor/master)
[![David-DM devDependencies](https://david-dm.org/ryor-org/ryor/dev-status.svg)](https://david-dm.org/ryor-org/ryor/master#info=devDependencies)
[![License](https://img.shields.io/github/license/ryor-org/ryor.svg)](https://github.com/ryor-org/ryor/blob/master/LICENSE)

### No system dependencies

Including **[ryor](https://www.npmjs.com/package/ryor)** as a project development dependency is all that's needed to get started.

### No plugins

Unlike task runners or pluggable build tools that require often clunky coordination between unevenly maintained 3rd-party plugins (Gulp, Grunt, Webpack, etc.), **ryor** adopts the [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy), preferring to just expose tools that "do one thing and do it well" to developers.  Any runnable can be run independently, which can be useful for debugging or stepping through sequences.

### Less clutter

Instead of cluttering of a project's root directory and/or package.json file with configuration files/details, runnables can be neatly self-contained.

### Sequences

Similar to shell, **npm**/**yarn** or [NPS](https://www.npmjs.com/package/nps), sequences can be composed that utilize runnables, either run in series or parallel.  If runnables defined as functions/Promises return sequences themselves, those operations are then run as well.

### Simple to define

Runnables can be defined in two subdirectories in a project's `run` directory, `tasks` and `tools`. Tasks are intended to be the main developer interface for a project, composing sequences that utilize other runnables. Tools are intended to be either "batteries included" versions of tools included as project dependencies, with all of the configuration details required to run properly, or functions/Promises that perform any necessary operations.  Runnables can also included an optional description, which is displayed in the usage information.

### Simple to get usage information

```node run```

### Simple to use

```node run <runnable> [...args]```

or

```node run <runnable> [...args] + <runnable> [...args] + <runnable> [...args]```

## Templates

[Node module with TypeScript, TSLint, Jest and Rollup](https://github.com/ryor-org/ryor-simple-module-template)<br>
[Node CLI module with TypeScript, TSLint, Jest and Rollup](https://github.com/ryor-org/ryor-cli-module-template)<br>
[Static generated Preact SPA with TypeScript, TSLint and Rollup](https://github.com/ryor-org/ryor-static-gen-spa-preact-template)

## Utility

[Command-line utility for initializing projects from ryor templates](https://github.com/ryor-org/ryor-init)
