## Roll Your Own (Task) Runner for Node.js Projects

[![Travis](https://img.shields.io/travis/ryor-org/ryor.svg)](https://travis-ci.org/ryor-org/ryor/branches)
[![Codecov](https://img.shields.io/codecov/c/github/ryor-org/ryor/v0.0.75.svg)](https://codecov.io/gh/ryor-org/ryor/branch/v0.0.75)
[![Greenkeeper](https://badges.greenkeeper.io/ryor-org/ryor.svg)](https://greenkeeper.io/)
[![David-DM dependencies](https://david-dm.org/ryor-org/ryor/master.svg)](https://david-dm.org/ryor-org/ryor/master)
[![David-DM devDependencies](https://david-dm.org/ryor-org/ryor/dev-status.svg)](https://david-dm.org/ryor-org/ryor/master#info=devDependencies)
[![License](https://img.shields.io/github/license/ryor-org/ryor.svg)](https://github.com/ryor-org/ryor/blob/master/LICENSE)

No plugins, no system dependencies, no cluttering of a project root with configuration files or a package.json file with configuration details and lengthy, difficult-to-maintain scripts. Just use `node run` to list a project's tasks and `node run [task]/[tool]/[executable]` to run either a task, a tool or any executable in the `node_modules/.bin` directory of a project.

### Use tools independently

Unlike task runners or pluggable build tools that require often clunky coordination between unevenly maintained 3rd-party plugins (Gulp, Grunt, Webpack, etc.), **ryor** adopts the [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy), preferring to expose the tools that "do one thing well" to developers. Sequences similar to shell, **npm**/**yarn** or [NPS](https://www.npmjs.com/package/nps) scripts can be composed that utilize tools or tools can just be used independently.

### No system dependencies

Including **ryor** as a project development dependency is all that's needed to get started.

### No clutter

Too many tools require configuration files on a project root and/or configuration blocks in a package.json file.  As much as possible, anything required to use a tool (including configuration files and/or scripts that use Node.js APIs) is contained in a directory for that specific tool (**run/tools/[tool]**).

### Simple usage

Just `node run [task]/[tool]`.  Tasks are intended to be the main developer interface for a project, composing scripts that run tools in series or parallel, and tools are exposed for use by tasks and debugging.

### Simple usage information

Running `node run` outputs a list of available tasks and `node run tools` outputs a list of available tools.

### Simple to roll

Just create a run directory that contains an index.js file with this one line: `require('ryor')`.  Then add as many tasks (in the **run/tasks** directory) and/or tools (in the **run/tools** directory) as you'd like.

## Sample Projects / Templates

Several coming soon.
