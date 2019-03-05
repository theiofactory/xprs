const fs = require('fs');
const path = require('path');
const Validator = require('./validator');

async function createController (type, name, destination, definitionArg) {
    try {
        await Validator.isIOExpress();
        try {
            if (typeof destination === 'undefined') {
                console.log('Controller name is required');
            }
            await Validator.ioExpressFileExists('controllers', name[0], `${destination}.controller.js`);
            console.log('You are trying to create a conroller that already exists');
        } catch (err) {
            // route edit
            try {
                await Validator.ioExpressFileExists('routes', '', `${name[0]}.js`);
                let routeContent = fs.readFileSync(path.join(process.cwd(), 'src/routes', `${name[0]}.js`)).toString();
                routeContent = routeContent.split('\n');
                const requireIndex = routeContent.findIndex(el => el.includes('const router = express.Router()')) - 1;
                routeContent = [...routeContent.slice(0, requireIndex), `const ${destination} = require('./../controllers/${name[0]}/${destination}.controller');`, ...routeContent.slice(requireIndex, routeContent.length)];
                let indexRoute;
                if (name.length === 1) {
                    indexRoute = routeContent.findIndex(el => el.includes('\'/\''));
                } else {
                    const pattern = `'/${(name.splice(1)).join('/')}'`;
                    indexRoute = routeContent.findIndex(el => el.includes(pattern));
                    if (indexRoute === -1) {
                        console.log('No such route exists');
                        return -1;
                    }
                }
                routeContent[indexRoute] = `${routeContent[indexRoute].slice(0, -2)}, ${destination});`;
                fs.writeFileSync(path.join(process.cwd(), 'src/routes', `${name[0]}.js`), routeContent.join('\n'));

                let controllerFileContent = fs.readFileSync(path.join(__dirname, '../dummy/controller.js')).toString();
                let controllerTestFileContent = fs.readFileSync(path.join(__dirname, '../dummy/controller.spec.js')).toString();
                controllerFileContent = controllerFileContent.replace(/CONTROLLER/g, destination);
                controllerTestFileContent = controllerTestFileContent.replace(/CONTROLLER/g, destination);
                controllerTestFileContent = controllerTestFileContent.replace(`./${destination}`, `./${destination}.controller`);
                await fs.writeFileSync(path.join(process.cwd(), 'src/controllers', name[0], `${destination}.controller.js`), controllerFileContent);
                await fs.writeFileSync(path.join(process.cwd(), 'src/controllers', name[0], `${destination}.controller.spec.js`), controllerTestFileContent);
                if (definitionArg) {
                    const def = {};
                    def[`${name}ControllerResponse`] = {
                        type: "",
                        example: ""
                    }
                    await fs.writeFileSync(path.join(process.cwd(), 'src/controllers', `${name}.definitions.swagger.json`), JSON.stringify(def, null, 4));
                }
                console.log(`Controller created successfully at ${path.join(name[0], `${destination}.controller.js`)}`);
                return -1;
            } catch (err) {
                console.log('No such route exists');
                return -1;
            }
        }
    } catch (err) {
        console.log(err);
        console.log(`Run 'xprs create' command from a valid 'IO Express' project root!`);
        return -1;
    }
}

module.exports = createController;
