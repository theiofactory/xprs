const program = require('commander');

const newCommand = require('./new');
const createRoute = require('./create/Route');
const createOthers = require('./create/Others');
const createSwagger = require('./create/Swagger');
const createController = require('./create/Controller');
const buildJsdoc = require('./build/jsdoc');
const buildSwagger = require('./build/swagger');

program
    .command('new <name>')
    .alias('n')
    .description(`\tCreate a new IO Express application. "xprs new my_app" creates a new application called my_app in "./my_app"`)
    .action(function(name) {
        newCommand(name);
    });

program
    .command('build <name>')
    .alias('b')
    .description(`\tBuilds jsdoc or swagger docs in given path`)
    .action(function(name) {
        if (name === 'jsdoc') {
            buildJsdoc();
        } else if (name === 'swagger') {
            buildSwagger();
        } else if (name === 'docs') {
            buildJsdoc();
            buildSwagger();
        }
    });

program
    .command('create <type> <name> [destination] [destinationFileName]')
    .alias('c')
    .option('--no-definition', 'Don\'t generate definition file')
    .option('--no-tag', 'Don\'t generate tag file')
    .option('--get', 'Create get method')
    .option('--post', 'Create post method')
    .option('--put', 'Create put method')
    .option('--delete', 'Create delete method')
    .parse(process.argv)

    .description(`\tThe "xprs create" command uses templates to create a whole lot of things.\n\n\troute <routename>\t\tcreates a IO Express Router with Controller with name.\n\tmodel <modelname>\t\tcreates a IO Express Model in the models directory.\n\thandler <handlername>\t\tcreates a IO Express Handler in the handler directory.\n\tmiddleware <middlewarename>\tcreates a IO Express Middleware in the middleware directory.\n\n\tswagger <type> <destination> <destinationFilename> Creates swagger type at the destination folder with destinationFilename.<type>.swagger.json\n\n\t\t definition <controller|handler|middleware|route> <destinationFilename> Creates IO Express Swagger Defintion at the destination folder with destinationFilename.definitions.swagger.json\n\n\t\t path <controller|handler|middleware|route> <destinationFilename> Creates IO Express Swagger Defintion at the destination folder with destinationFilename.definitions.swagger.json\n\n\t\t component <controller|handler|middleware|route> <destinationFilename> Creates IO Express Swagger Defintion at the destination folder with destinationFilename.definitions.swagger.json\n\n\t\t securityDefination <controller|handler|middleware|route> <destinationFilename> Creates IO Express Swagger Defintion at the destination folder with destinationFilename.definitions.swagger.json\n`)
    .action(function(type, name, destination, destinationFileName, args){
        if (type === 'route') {
            name = name.split("/");
            const directoryName = name.shift();
            createRoute('routes', directoryName, name.join('/'), args);
        } else if(type === 'controller') {
            name = name.split('/');
            createController(type, name, destination, args.definition);
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