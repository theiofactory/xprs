const fs = require('fs');
const path = require('path');

async function newRoute(name) {
    // read & copy controller route
    const dummyController = fs.readFileSync(path.join(__dirname, '../dummy/controller.js')).toString();
    fs.mkdirSync(path.join(process.cwd(), '/src/controller', name));
    fs.writeFileSync(path.join(process.cwd(), 'src/controller', name, 'index.controller.js'), dummyController);
    // read & copy dummy route
    let dummyRoute = fs.readFileSync(path.join(__dirname, '../dummy/route.js')).toString();
    dummyRoute = dummyRoute.replace(/controller/g, 'index');
    dummyRoute = dummyRoute.replace('./index', `./../controller/${name}/index.controller`);
    fs.writeFileSync(path.join(process.cwd(), 'src/routes', `${name}.js`), dummyRoute);
    // read & edit main route
    let routeFile = fs.readFileSync(path.join(process.cwd(), 'src/routes/index.js')).toString();
    routeFile = routeFile.split('\n');
    // import controller
    const importBeforeIndex = routeFile.findIndex(item => item.includes('const router =')) - 1;
    routeFile = [...routeFile.slice(0, importBeforeIndex), `import ${name} from './${name}';`, ...routeFile.slice(importBeforeIndex, routeFile.length)];
    // edit routes
    const insertBeforeIndex = routeFile.findIndex(item => item.includes('export default')) - 1;
    routeFile = [...routeFile.slice(0, insertBeforeIndex), `router.use('/${name}', ${name});`, ...routeFile.slice(insertBeforeIndex, routeFile.length)];
    // save route
    fs.writeFileSync(path.join(process.cwd(), 'src/routes/index.js'), routeFile.join('\n'));
}

module.exports = newRoute;
