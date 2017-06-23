## Roll Your Own (Task) Runner for Node.js Projects

[![Travis](https://img.shields.io/travis/ryor-org/ryor.svg)](https://travis-ci.org/ryor-org/ryor/branches)
[![Codecov](https://img.shields.io/codecov/c/github/ryor-org/ryor/v0.1.2.svg)](https://codecov.io/gh/ryor-org/ryor/branch/v0.1.2)
[![Greenkeeper](https://badges.greenkeeper.io/ryor-org/ryor.svg)](https://greenkeeper.io/)
[![David-DM dependencies](https://david-dm.org/ryor-org/ryor/master.svg)](https://david-dm.org/ryor-org/ryor/master)
[![David-DM devDependencies](https://david-dm.org/ryor-org/ryor/dev-status.svg)](https://david-dm.org/ryor-org/ryor/master#info=devDependencies)
[![License](https://img.shields.io/github/license/ryor-org/ryor.svg)](https://github.com/ryor-org/ryor/blob/master/LICENSE)

No plugins, no system dependencies, no cluttering of a project root with configuration files or a package.json file with configuration details and/or lengthy, difficult-to-maintain scripts. Just use `node run` to list a project's runnables and `node run **runnable**` to run either a task, a tool or any executable either in the `node_modules/.bin` directory of a project or available system-wide.

### Use tools independently

Unlike task runners or pluggable build tools that require often clunky coordination between unevenly maintained 3rd-party plugins (Gulp, Grunt, Webpack, etc.), **ryor** adopts the [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy), preferring to just expose tools that "do one thing and do it well" to developers.  Any runnable can be run independently, which can be useful for debugging or stepping through sequences.

### Sequences

Similar to shell, **npm**/**yarn** or [NPS](https://www.npmjs.com/package/nps), sequences can be composed that utilize runnables, either run in series or parallel.  If runnables defined as functions/Promises return sequences themselves, those operations are then run as well.

### No system dependencies

Including **ryor** as a project development dependency is all that's needed to get started.

### No clutter

Too many tools require configuration files on a project root and/or configuration blocks in a package.json file.  As much as possible, anything required to use a tool (including configuration files and/or scripts that use Node.js APIs) is contained in a directory for that specific tool (**run/tools/[tool]**).

### Simple to define

Runnables can be defined in two directories in the **run** directory on a project root, **tasks** and **tools**. Tasks are intended to be the main developer interface for a project, composing sequences that utilize other runnables, and tools are intended to be either "batteries included" versions of tools included as project dependencies, with all of the configuration details required to run properly defined in the runnable, or functions/Promises that perform any necessary operations.

### Simple to get usage information

`node run`

### Simple to use

`node run **runnable** [...args]` or `node run **runnable** [...args] + **runnable** [...args] + **runnable** [...args] ...`

## Templates

[Simple Node module with TypeScript, TSLint, Jest and Rollup](https://github.com/ryor-org/ryor-simple-module-template)
[Simple Node CLI module with TypeScript, TSLint, Jest and Rollup](https://github.com/ryor-org/ryor-cli-module-template)
[Static generated Preact SPA with TypeScript, TSLint and Rollup](https://github.com/ryor-org/ryor-static-gen-spa-preact-template)

## Utility

[Command-line utility for initializing projects from ryor templates](https://github.com/ryor-org/ryor-init)
