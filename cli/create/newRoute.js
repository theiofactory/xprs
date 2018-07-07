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
}

module.exports = newRoute;
