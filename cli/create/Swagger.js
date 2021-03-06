const fs = require('fs');
const path = require('path');

const Validator = require('./validator');

async function createRoute(type, name, destination, destinationFileName) {
    try {
        await Validator.isIOExpress();
        try {
            await Validator.ioExpressFileExists((destination[destination.length-1] === 's') ? destination : destination + 's', (destination === 'controller') ? destinationFileName.split('.')[0] : '', `${(destinationFileName.indexOf('.') > -1) ? destinationFileName.split('.')[1] : (destination === 'route') ? destinationFileName : 'index'}.${(name[name.length - 1] === 's') ? name : name + 's'}.swagger.json`);
            console.log('You are trying to create a swagger defination that already exists.')
        } catch (e) {
            const def = {};
            if (name === 'definition' || name === 'component') {
                if (name === 'definition') {
                    def[`${(destinationFileName.indexOf('.') > -1) ? destinationFileName.split('.')[1] : 'index'}ControllerResponse`] = {
                        type: "",
                        example: ""
                    }
                }
                const filePath = path.join(process.cwd(), 'src', (destination[destination.length-1] === 's') ? destination : destination + 's', (destination === 'controller') ? destinationFileName.split('.')[0] : '', `${(destinationFileName.indexOf('.') > -1) ? destinationFileName.split('.')[1] : (destination === 'route') ? destinationFileName : 'index'}.${(name[name.length - 1] === 's') ? name : name + 's'}.swagger.json`);
                fs.writeFileSync(filePath, JSON.stringify(def, null, 4));
                console.log(`Swagger ${name} created: ${filePath}`);
                return -1;
            }
            if (!((name === 'path' || name === 'securityDefination' || name === 'tags') && destination === 'route')) {
                console.log(`You are trying to create swagger ${name} in wrong directory`);
                console.log(`Swagger ${name} should be created in routes`);
                return -1;
            }
            const filePath = path.join(process.cwd(), 'src', 'routes', `${destinationFileName}.${(name[ name.length -1 ] === 's') ? name : name + 's'}.swagger.json`);
            fs.writeFileSync(filePath, JSON.stringify(def, null, 4));
            console.log(`Swagger ${name} created: ${filePath}`);
            return -1;
        }
    } catch (e) {
        console.log(e);
        console.log(`Run 'xprs create' command from a valid 'IO Express' project root!`);
        return -1;
    }
}

module.exports = createRoute;
