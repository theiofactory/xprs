const program = require('commander');
const newCommand = require('./new');
const createRoute = require('./create/Route');
const createOthers = require('./create/Others');
const createSwagger = require('./create/Swagger');

program
    .command('new <name>')
    .alias('n')
    .description(`\tCreate a new IO Express application. "xprs new my_app" creates a new application called my_app in "./my_app"`)
    .action(function(name) {
        newCommand(name);
    });

program
    .command('create <type> <name> <destination> <destinationFileName>')
    .alias('c')
    .description(`\tThe "xprs create" command uses templates to create a whole lot of things.\n\n\troute <routename>\t\tcreates a IO Express Router with Controller with name.\n\tmodel <modelname>\t\tcreates a IO Express Model in the models directory.\n\tmiddleware <middlewarename>\tcreates a IO Express Middleware in the middleware directory.\n`)
    .action(function(type, name, destination, destinationFileName){
        if (type === 'route') {
            name = name.split("/");
            createRoute('routes', name.slice(0, name.length - 1).join('/'), name[name.length - 1]);
        } else if (type === 'route') {
            createOthers(type, name);
        } else if (type === 'handler') {
            createOthers(type, name);
        } else if (type === 'middleware') {
            createOthers(type, name);
        } else if (type === 'model') {
            createOthers(type, name);
        } else if (type === 'swagger') {
            createSwagger(type, name, destination, destinationFileName);
        }
    });
if (process.argv.length < 3) {
    program.help()
}

module.exports = program;