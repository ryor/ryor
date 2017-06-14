console.log(process.cwd())

require('child_process').spawn('cd', ['build'], {stdio:'inherit'}).on('close', () => console.log(process.cwd()))
