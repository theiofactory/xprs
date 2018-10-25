const fs = require('fs');
const del = require('del');
const path = require('path');
var shell = require('shelljs');

function createProject(package) {
    const currentDir = process.cwd();
    const outputDir = path.join(currentDir, package.name);
    
    console.log("Cloning Git Repository");
    const clonning = shell.exec(`git clone -b v2 --single-branch https://github.com/theiofactory/restapi ${package.name}`)
    if(clonning.code !== 0) {
        return -1;
    }
    del.sync(`${ outputDir }/.git`);

    console.log("Generating new package.json");
    var packageJSON = JSON.parse(fs.readFileSync(`${ outputDir }/package.json`).toString());
    packageJSON = Object.assign({}, packageJSON, package);
    del.sync(`${ outputDir }/package.json`);
    fs.writeFileSync(`${ outputDir }/package.json`, JSON.stringify(packageJSON, null, 4), 'utf8');

    console.log("Installing Dependencies");
    const npmInstall = shell.exec(`cd ${outputDir} && npm install && cd ${currentDir}`)
    if(npmInstall.code !== 0) {
        return -1;
    }
}
module.exports = createProject;
