## Roll Your Own (Task) Runner for Node.js Projects

[![Travis](https://img.shields.io/travis/movecodemove/ryor.svg)](https://travis-ci.org/movecodemove/ryor)
[![Codecov](https://img.shields.io/codecov/c/github/movecodemove/ryor.svg)](https://codecov.io/gh/movecodemove/ryor)
[![License](https://img.shields.io/github/license/movecodemove/ryor.svg)](https://github.com/movecodemove/ryor/blob/master/LICENSE)

No plugins, no global dependencies, no cluttering of a project root with configuration files or a package.json file with configuration details and lengthy, difficult-to-mantain scripts. Simply install development dependencies as usual with **npm** or **yarn** and `node run` will list available project tasks and tools.

### Tools that "do one thing and do it well"

Like the [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy), **ryor** projects prefer tools should "do one thing and do it well" over task runners that requiring unevenly maintained 3rd-party plugins (like Gulp, Grunt, Webpack, etc.).

### Package scripts

Most tasks can be handled with "NPM scripts", but they can start to multiply quickly in a package.json file and be difficult to maintain.  [NPS](https://www.npmjs.com/package/nps) solves those problems by separating "package scripts" out of package.json files, allowing for more robust and maintainable "package" scripting.

### No global dependencies

As often as reasonably possible, a project's development dependencies should contain all that is required for development on the project (with the exception of **Node.js** and **npm** or **yarn**).  Including **ryor** as a project development dependency is all that's required to get started rolling your own runner.

### No clutter

Too many tools require configuration files on a project root and/or configuration blocks in a package.json file.  As much as possible, anything required to use a tool (including configuration files and/or scripts that use Node.js APIs) is contained in a **run/tools/[tool]** directory.

### Simple usage information

Running `node run` on a **ryor** project will output a list of available tasks and `node run tools` will list available tools.

### Simple usage

Just **node run [TASK]/[TOOL]**.  Tasks compose NPS scripts that run tools in series or parallel and tools are exposed for use by tasks and debugging.

### Simple to roll

Just create a run directory that contains an index.js file with this one line: `require('ryor').run()`.  Then add as many tasks (in the **run/tasks**) and/or tools (in the **run/tools**) as you'd like.

## Sample Projects / Templates

Several coming soon.
