const fs = require('fs');
const path = require('path');

async function newSubRoute(directory, name, method) {
    const importName = `${method}${name.charAt(0).toUpperCase()}${name.slice(1, name.length)}`;
    // read & copy controller route
    const dummyController = fs.readFileSync(path.join(__dirname, '../dummy/controller.js')).toString();
    fs.writeFileSync(path.join(process.cwd(), 'src/controller', directory, `${importName}.controller.js`), dummyController);
    // read & edit route
    let routeFile = fs.readFileSync(path.join(process.cwd(), 'src/routes', `${directory}.js`)).toString();
    routeFile = routeFile.split('\n');
    // import controller
    const importBeforeIndex = routeFile.findIndex(item => item.includes('const router =')) - 1;
    routeFile = [...routeFile.slice(0, importBeforeIndex), `import ${importName} from './../controller/${directory}/${importName}.controller';`, ...routeFile.slice(importBeforeIndex, routeFile.length)];
    // edit routes
    const insertBeforeIndex = routeFile.findIndex(item => item.includes('export default')) - 1;
    routeFile = [...routeFile.slice(0, insertBeforeIndex), `router.${method}('/${name}', ${importName});`, ...routeFile.slice(insertBeforeIndex, routeFile.length)];
    // save route
    fs.writeFileSync(path.join(process.cwd(), 'src/routes', `${directory}.js`), routeFile.join('\n'));
}

module.exports = newSubRoute;
