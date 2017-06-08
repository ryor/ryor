## Roll Your Own (Task) Runner for Node.js Projects

[![Travis](https://img.shields.io/travis/ryor-org/ryor.svg)](https://travis-ci.org/ryor-org/ryor)
[![Codecov](https://img.shields.io/codecov/c/github/ryor-org/ryor/v0.0.43.svg)](https://codecov.io/gh/ryor-org/ryor/branch/v0.0.43)
[![License](https://img.shields.io/github/license/ryor-org/ryor.svg)](https://github.com/ryor-org/ryor/blob/master/LICENSE)

No plugins, no global dependencies, no cluttering of a project root with configuration files or a package.json file with configuration details and lengthy, difficult-to-mantain scripts. Simply install development dependencies as usual with **npm** or **yarn** and `node run` will list available project tasks and tools.

### Tools that "do one thing and do it well"

Unlike task runners or pluggable build tools that require often clunky coordination between unevenly maintained 3rd-party plugins (Gulp, Grunt, Webpack, etc.), **ryor** adopts the [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy), preferring to use tools that "do one thing and do it well".

### Package scripts

"NPM scripts" can handle many tasks, but they can multiply quickly in a package.json file and be difficult to maintain.  [NPS](https://www.npmjs.com/package/nps) solves those problems by separating "package scripts" out of package.json files, allowing for more robust and maintainable "package" scripting.

### No global dependencies

**Node.js** and **npm** or **yarn** are the only system dependencies required and including **ryor** as a project development dependency is all that's needed to get started.

### No clutter

Too many tools require configuration files on a project root and/or configuration blocks in a package.json file.  As much as possible, anything required to use a tool (including configuration files and/or scripts that use Node.js APIs) is contained in a directory for that specific tool (**run/tools/[tool]**).

### Simple usage

Just `node run [task]/[tool]`.  Tasks are intended to be the main developer interface for a project, composing scripts that run tools in series or parallel, and tools are exposed for use by tasks and debugging.

### Simple usage information

Running `node run` outputs a list of available tasks and `node run tools` outputs a list of available tools.

### Simple to roll

Just create a run directory that contains an index.js file with this one line: `require('ryor').run()`.  Then add as many tasks (in the **run/tasks** directory) and/or tools (in the **run/tools** directory) as you'd like.

## Sample Projects / Templates

Several coming soon.
