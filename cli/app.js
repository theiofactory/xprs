const program = require('commander');

program
    .command('new <name>')
    .alias('n')
    .description(`\tCreate a new IO Express application. "xprs new my_app" creates a new application called my_app in "./my_app"`)
    .action(function(name) {
    });

if (process.argv.length < 3) {
    program.help()
}

module.exports = program;