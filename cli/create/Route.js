const Validator = require('./validator');
const newRoute = require('./newRoute');
const newSubRoute = require('./newSubRoute');

async function createRoute(type, directory, name, args) {
    try {
        let methods = {
            get: args.get,
            post: args.post,
            put: args.put,
            delete: args.delete,
        };
        const inputs = (Object.keys(methods)).filter(el => methods[el] === true);
        if (inputs.length > 1) {
            console.log('You can provide only one method');
            return -1;
        }
        await Validator.isIOExpress();
        try {
            if (directory.length === 0) {
                await Validator.ioExpressFileExists(type, './', `${name}.js`);
                console.log(`You are trying to create a route that already exists.`);
                console.log(`If you want to create a sub route for /${name} then try '/${name}/<your sub route>'`);
                return -1;
            }
            try {
                await Validator.ioExpressDirectoryExists('controllers', directory);
                await Validator.ioExpressFileExists(type, './', `${directory}.js`);
                try {
                    await Validator.ioExpressFileExists('controllers', directory, `${name}.controller.js`);
                    console.log(`You are trying to create a sub route that already exists.`);
                    return -1;
                } catch (e) {
                    newSubRoute(directory, name, (inputs.length === 0) ? 'get' : inputs[0], args.definition);
                }
            } catch (e) {
                console.log(`Create the route /${ directory } first!`);
            }
            return -1;
        } catch (e) {
            newRoute(name, args.tag, args.definition, (inputs.length === 0) ? 'get' : inputs[0]);
        }
    } catch (e) {
        console.log(`Run 'xprs create' command from a valid 'IO Express' project root!`);
        return -1;
    }
}

module.exports = createRoute;
