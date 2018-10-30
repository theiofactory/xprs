const fs = require('fs');
const path = require('path');

async function newSubRoute(directory, name, method) {
    const importName = `${method}${name.charAt(0).toUpperCase()}${name.slice(1, name.length)}`;
    // read & copy controller route
    let dummyController = fs.readFileSync(path.join(__dirname, '../dummy/controller.js')).toString();
    dummyController = dummyController.replace(/CONTROLLER/g, name);
    fs.writeFileSync(path.join(process.cwd(), 'src/controllers', directory, `${importName}.controller.js`), dummyController);
    // read & copy controller test
    let dummyControllerTest = fs.readFileSync(path.join(__dirname, '../dummy/controller.spec.js')).toString();
    dummyControllerTest = dummyControllerTest.replace(/CONTROLLER/g, name);
    dummyControllerTest = dummyControllerTest.replace(`./${name}`, `./${importName}.controller`);
    fs.writeFileSync(path.join(process.cwd(), 'src/controllers', directory, `${importName}.controller.spec.js`), dummyControllerTest);
    // read & copy dummy e2e test
    let dummyRouteE2ETest = fs.readFileSync(path.join(__dirname, '../dummy/route.spec.js')).toString();
    dummyRouteE2ETest = dummyRouteE2ETest.replace(/ROUTE/g, `${directory}/${name}`);
    fs.writeFileSync(path.join(process.cwd(), 'e2e', directory, `${importName}.spec.js`), dummyRouteE2ETest);
    // read & edit route
    let routeFile = fs.readFileSync(path.join(process.cwd(), 'src/routes', `${directory}.js`)).toString();
    routeFile = routeFile.split('\n');
    // import controller
    const importBeforeIndex = routeFile.findIndex(item => item.includes('const router =')) - 1;
    routeFile = [...routeFile.slice(0, importBeforeIndex), `const ${importName} = require('./../controllers/${directory}/${importName}.controller');`, ...routeFile.slice(importBeforeIndex, routeFile.length)];
    // edit routes
    const insertBeforeIndex = routeFile.findIndex(item => item.includes('module.exports')) - 1;
    routeFile = [...routeFile.slice(0, insertBeforeIndex), `router.${method}('/${name}', ${importName});`, ...routeFile.slice(insertBeforeIndex, routeFile.length)];
    // save route
    fs.writeFileSync(path.join(process.cwd(), 'src/routes', `${directory}.js`), routeFile.join('\n'));
    console.log(`Controller         :  src/controllers/${directory}/${importName}.controller.js`);
    console.log(`Sub Route          :  src/routes/${directory}.js [route: ${name}]`);
    console.log(`Controller Test    :  src/controllers/${directory}/${importName}.controller.spec.js`);
    console.log(`Sub Route E2E Test :  e2e/${directory}/${importName}.spec.js`);
}

module.exports = newSubRoute;
