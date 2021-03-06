const fs = require('fs');
const path = require('path');

Array.prototype.multiIndexOf = function (el) { 
    var idxs = [];
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] === el) {
            idxs.unshift(i);
        }
    }
    return idxs;
};

async function newSubRoute(directory, name, method, definitionArg) {
    let importName = `${method}${(((name.humanize('/')).humanize(':')).humanize('-')).humanize('_')}`;
    if (!name) {
        importName = `${importName}${directory.charAt(0).toUpperCase()}${directory.slice(1).toLowerCase()}`;
    }
    // read & edit route
    let routeFile = fs.readFileSync(path.join(process.cwd(), 'src/routes', `${directory}.js`)).toString();
    routeFile = routeFile.split('\n');
    const checkMethodExistance = routeFile.findIndex(el => el === `router.${method}('/${name}', ${importName});`);
    if (checkMethodExistance !== -1) {
        console.log('Route already exists');
        return -1;
    }
    // Updare swagger path file
    const currentPathFile = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/routes', `${directory}.paths.swagger.json`)).toString());
    const swaggerMethodPath = `/${((name.split('/')).map(el => (el[0] === ':') ? `{${el.slice(1)}}` : el)).join('/')}`
    currentPathFile[swaggerMethodPath] = {};
    currentPathFile[swaggerMethodPath][method] = {
        description: `${method} ${name} Status Page`,
            tags: [
                directory
            ],
            produces: [
                'text/plain',
                'application/json'
            ],
            responses: {
                '200': {
                    'description': 'returns success message',
                    'schema': {
                        '$ref': '#/definitions/indexControllerResponse'
                    }
                },
                '400': {
                    '$ref': '#/components/responses/400'
                },
                '401': {
                    '$ref': '#/components/responses/401'
                },
                '404': {
                    '$ref': '#/components/responses/404'
                },
                '500': {
                    '$ref': '#/components/responses/500'
                }
            }
    }
    fs.writeFileSync(path.join(process.cwd(), 'src/routes', `${directory}.paths.swagger.json`), JSON.stringify(currentPathFile, null, 4));
    // read & copy controller route
    let dummyController = fs.readFileSync(path.join(__dirname, '../dummy/controller.js')).toString();
    dummyController = dummyController.replace(/CONTROLLER/g, importName);
    fs.writeFileSync(path.join(process.cwd(), 'src/controllers', directory, `${importName}.controller.js`), dummyController);
    if (definitionArg) {
        const def = {};
        def[`${importName}ControllerResponse`] = {
            type: '',
            example: ''
        }
        fs.writeFileSync(path.join(process.cwd(), 'src/controllers', directory, `${importName}.definitions.swagger.json`), JSON.stringify(def, null, 4));
    }
    // read & copy controller test
    let dummyControllerTest = fs.readFileSync(path.join(__dirname, '../dummy/controller.spec.js')).toString();
    dummyControllerTest = dummyControllerTest.replace(/CONTROLLER/g, importName);
    dummyControllerTest = dummyControllerTest.replace(`./${importName}`, `./${importName}.controller`);
    fs.writeFileSync(path.join(process.cwd(), 'src/controllers', directory, `${importName}.controller.spec.js`), dummyControllerTest);
    // read & copy dummy e2e test
    let dummyRouteE2ETest = fs.readFileSync(path.join(__dirname, '../dummy/route.spec.js')).toString();
    dummyRouteE2ETest = dummyRouteE2ETest.replace(/ROUTE/g, `${directory}/${name}`);
    fs.writeFileSync(path.join(process.cwd(), 'e2e', directory, `${importName}.spec.js`), dummyRouteE2ETest);
    
    // import controller
    const importBeforeIndex = routeFile.findIndex(item => item.includes('const router =')) - 1;
    routeFile = [...routeFile.slice(0, importBeforeIndex), `const ${importName} = require('./../controllers/${directory}/${importName}.controller');`, ...routeFile.slice(importBeforeIndex, routeFile.length)];
    // edit routes
    const insertBeforeIndex = routeFile.findIndex(item => item.includes('module.exports')) - 1;
    routeFile = [...routeFile.slice(0, insertBeforeIndex), `router.${method}('/${name}', ${importName});`, ...routeFile.slice(insertBeforeIndex, routeFile.length)];
    // save route
    fs.writeFileSync(path.join(process.cwd(), 'src/routes', `${directory}.js`), routeFile.join('\n'));
    console.log(`Controller         :  src/controllers/${directory}/${importName}.controller.js`);
    console.log(`Sub Route          :  src/routes/${directory}.js [route: ${importName}]`);
    console.log(`Controller Test    :  src/controllers/${directory}/${importName}.controller.spec.js`);
    console.log(`Sub Route E2E Test :  e2e/${directory}/${importName}.spec.js`);
}

module.exports = newSubRoute;
