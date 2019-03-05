const fs = require('fs');
const path = require('path');

async function newRoute(name, tagArg, definitionArg, method) {
    // read & copy controller route
    let dummyController = fs.readFileSync(path.join(__dirname, '../dummy/controller.js')).toString();
    dummyController = dummyController.replace(/CONTROLLER/g, `${method}${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`);
    fs.mkdirSync(path.join(process.cwd(), '/src/controllers', name));
    fs.writeFileSync(path.join(process.cwd(), 'src/controllers', name, `${method}${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}.controller.js`), dummyController);
    if (definitionArg) {
        const def = {
            indexControllerResponse: {
                type: '',
                example: ''
            }
        };
        fs.writeFileSync(path.join(process.cwd(), 'src/controllers', name, `${method}${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}.definitions.swagger.json`), JSON.stringify(def, null, 4));
    }
    // read & copy dummy controller test
    let dummyControllerTest = fs.readFileSync(path.join(__dirname, '../dummy/controller.spec.js')).toString();
    dummyControllerTest = dummyControllerTest.replace(/CONTROLLER/g, `${method}${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`);
    dummyControllerTest = dummyControllerTest.replace('./PATH', `./${method}${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}.controller`);
    fs.writeFileSync(path.join(process.cwd(), 'src/controllers', name, `${method}${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}.controller.spec.js`), dummyControllerTest);
    // read & copy dummy route
    let dummyRoute = fs.readFileSync(path.join(__dirname, '../dummy/route.js')).toString();
    dummyRoute = dummyRoute.replace(/CONTROLLER/g, `${method}${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`);
    dummyRoute = dummyRoute.replace('./PATH', `./../controllers/${name}/${method}${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}.controller`);
    if (method !== 'get') {
        dummyRoute = dummyRoute.split('\n');
        const dummyRouteIndex = dummyRoute.findIndex(item => item === `router.get('/', index);`);
        dummyRoute[dummyRouteIndex] = `router.${method}('/', index);`;
        dummyRoute = dummyRoute.join('\n');
    }
    fs.writeFileSync(path.join(process.cwd(), 'src/routes', `${name}.js`), dummyRoute);
    // copy dummy swagger path file
    let swaggerPath = {
        '/': {}
    }
    swaggerPath['/'][method] = {
        description: `${name} Status Page`,
        tags: [
            name
        ],
        produces: [
            "text/plain",
            "application/json"
        ],
        responses: {
            "200": {
                "description": "returns success message",
                "schema": {
                    "$ref": "#/definitions/indexControllerResponse"
                }
            },
            "400": {
                "$ref": "#/components/responses/400"
            },
            "401": {
                "$ref": "#/components/responses/401"
            },
            "404": {
                "$ref": "#/components/responses/404"
            },
            "500": {
                "$ref": "#/components/responses/500"
            }
        }
    }
    await fs.writeFileSync(path.join(process.cwd(), 'src/routes', `${name}.paths.swagger.json`), JSON.stringify(swaggerPath, null, 4));
    await fs.writeFileSync(path.join(process.cwd(), 'src/routes', `${name}.components.swagger.json`), JSON.stringify({}, null, 4));
    if (tagArg) {
        const tagContent = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/routes/index.tags.swagger.json')).toString());
        const checkIfTagExists = tagContent.findIndex(el => el.name === name);
        if (checkIfTagExists === -1) {
            tagContent.push({ name, description: `Everything about ${name} route` });
            fs.writeFileSync(path.join(process.cwd(), 'src/routes/index.tags.swagger.json'), JSON.stringify(tagContent, null, 4));
        }
    }
    // read & copy dummy e2e test
    let dummyRouteE2ETest = fs.readFileSync(path.join(__dirname, '../dummy/route.spec.js')).toString();
    dummyRouteE2ETest = dummyRouteE2ETest.replace(/ROUTE/g, `/${name}`);
    if (!fs.existsSync(path.join(process.cwd(), 'e2e'))) {
        fs.mkdirSync(path.join(process.cwd(), 'e2e'));
    }
    fs.mkdirSync(path.join(process.cwd(), 'e2e', name));
    fs.writeFileSync(path.join(process.cwd(), 'e2e', name, `${method}${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}.spec.js`), dummyRouteE2ETest);
    // read & edit main route
    let routeFile = fs.readFileSync(path.join(process.cwd(), 'src/routes/index.js')).toString();
    routeFile = routeFile.split('\n');
    const checkIfImportExists = routeFile.findIndex(el => el === `const ${name} = require('./${name}');`);
    if (checkIfImportExists === -1) {
        // import controller
        const importBeforeIndex = routeFile.findIndex(item => item.includes('const router =')) - 1;
        routeFile = [...routeFile.slice(0, importBeforeIndex), `const ${name} = require('./${name}');`, ...routeFile.slice(importBeforeIndex, routeFile.length)];
        // edit routes
        const insertBeforeIndex = routeFile.findIndex(item => item.includes('module.exports')) - 1;
        routeFile = [...routeFile.slice(0, insertBeforeIndex), `router.use('/${name}', ${name});`, ...routeFile.slice(insertBeforeIndex, routeFile.length)];
        // save route
        fs.writeFileSync(path.join(process.cwd(), 'src/routes/index.js'), routeFile.join('\n'));
    }

    console.log(`Controller      :  src/controllers/${name}/${method}${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}.controller.js`);
    console.log(`Route           :  src/routes/${name}.js`);
    console.log(`Controller Test :  src/controllers/${name}/${method}${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}.controller.spec.js`);
    console.log(`Route E2E Test  :  e2e/${name}/index.spec.js`);
}

module.exports = newRoute;
