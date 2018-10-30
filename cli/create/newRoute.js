const fs = require('fs');
const path = require('path');

async function newRoute(name) {
    // read & copy controller route
    let dummyController = fs.readFileSync(path.join(__dirname, '../dummy/controller.js')).toString();
    dummyController = dummyController.replace(/CONTROLLER/g, 'index');
    fs.mkdirSync(path.join(process.cwd(), '/src/controllers', name));
    fs.writeFileSync(path.join(process.cwd(), 'src/controllers', name, 'index.controller.js'), dummyController);
    // read & copy dummy controller test
    let dummyControllerTest = fs.readFileSync(path.join(__dirname, '../dummy/controller.spec.js')).toString();
    dummyControllerTest = dummyControllerTest.replace(/CONTROLLER/g, 'index');
    dummyControllerTest = dummyControllerTest.replace('./index', './index.controller');
    fs.writeFileSync(path.join(process.cwd(), 'src/controllers', name, 'index.controller.spec.js'), dummyControllerTest);
    // read & copy dummy route
    let dummyRoute = fs.readFileSync(path.join(__dirname, '../dummy/route.js')).toString();
    dummyRoute = dummyRoute.replace(/CONTROLLER/g, 'index');
    dummyRoute = dummyRoute.replace('./index', `./../controllers/${name}/index.controller`);
    fs.writeFileSync(path.join(process.cwd(), 'src/routes', `${name}.js`), dummyRoute);
    // copy dummy swagger path file
    let swaggerPath = {
        '/': {
            get: {
                description: "API Status Page",
                tags: [
                    "index"
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
        }
    }
    fs.writeFileSync(path.join(process.cwd(), 'src/routes', `${name}.paths.swagger.json`), JSON.stringify(swaggerPath, null, 4));
    fs.writeFileSync(path.join(process.cwd(), 'src/routes', `${name}.components.swagger.json`), JSON.stringify({}, null, 4));
    // read & copy dummy e2e test
    let dummyRouteE2ETest = fs.readFileSync(path.join(__dirname, '../dummy/route.spec.js')).toString();
    dummyRouteE2ETest = dummyRouteE2ETest.replace(/ROUTE/g, `/${name}`);
    if (!fs.existsSync(path.join(process.cwd(), 'e2e'))) {
        fs.mkdirSync(path.join(process.cwd(), 'e2e'));
    }
    fs.mkdirSync(path.join(process.cwd(), 'e2e', name));
    fs.writeFileSync(path.join(process.cwd(), 'e2e', name, 'index.spec.js'), dummyRouteE2ETest);
    // read & edit main route
    let routeFile = fs.readFileSync(path.join(process.cwd(), 'src/routes/index.js')).toString();
    routeFile = routeFile.split('\n');
    // import controller
    const importBeforeIndex = routeFile.findIndex(item => item.includes('const router =')) - 1;
    routeFile = [...routeFile.slice(0, importBeforeIndex), `const ${name} = require('./${name}');`, ...routeFile.slice(importBeforeIndex, routeFile.length)];
    // edit routes
    const insertBeforeIndex = routeFile.findIndex(item => item.includes('module.exports')) - 1;
    routeFile = [...routeFile.slice(0, insertBeforeIndex), `router.use('/${name}', ${name});`, ...routeFile.slice(insertBeforeIndex, routeFile.length)];
    // save route
    fs.writeFileSync(path.join(process.cwd(), 'src/routes/index.js'), routeFile.join('\n'));

    console.log(`Controller      :  src/controllers/${name}/index.controller.js`);
    console.log(`Route           :  src/routes/${name}.js`);
    console.log(`Controller Test :  src/controllers/${name}/index.controller.spec.js`);
    console.log(`Route E2E Test  :  e2e/${name}/index.spec.js`);
}

module.exports = newRoute;
