const Validator = require('./validator');
const newRoute = require('./newRoute');
const newSubRoute = require('./newSubRoute');

async function createRoute(type, directory, name) {
    try {
        await Validator.isIOExpress();
        try {
            if (directory.length === 0) {
                await Validator.ioExpressFileExists(type, './', `${name}.js`);
                console.log(`You are trying to create a route that already exists.`);
                console.log(`If you want to create a sub route for /${name} then try '/${name}/<your sub route>'`);
                return -1;
            }
            try {
                await Validator.ioExpressDirectoryExists('controller', directory);
                await Validator.ioExpressFileExists(type, './', `${directory}.js`);
                try {
                    await Validator.ioExpressFileExists('controller', directory, `${name}.controller.js`);
                    console.log(`You are trying to create a sub route that already exists.`);
                    return -1;
                } catch (e) {
                    newSubRoute(directory, name, 'get');
                }
            } catch (e) {
                console.log(`Create the route /${ directory } first!`);
            }
            return -1;
        } catch (e) {
            newRoute(name);
        }
    } catch (e) {
        console.log(`Run 'xprs create' command from a valid 'IO Express' project root!`);
        return -1;
    }
}

module.exports = createRoute;
