const fs = require('fs');
const del = require('del');
const path = require('path');
const shell = require('shelljs');

function createProject(package) {
    const currentDir = process.cwd();
    const outputDir = path.join(currentDir, package.name);

    console.log("Cloning Git Repository");
    const clonning = shell.exec(`git clone https://github.com/theiofactory/restapi ${package.name}`)
    if(clonning.code !== 0) {
        return -1;
    }
    del.sync(`${ outputDir }/.git`);

    console.log("Generating new package.json");
    let packageJSON = JSON.parse(fs.readFileSync(`${ outputDir }/package.json`).toString());
    packageJSON = Object.assign({}, packageJSON, package);
    del.sync(`${ outputDir }/package.json`);
    fs.writeFileSync(`${ outputDir }/package.json`, JSON.stringify(packageJSON, null, 4), 'utf8');

    console.log('Generating env');
    let env = fs.readFileSync(path.join(__dirname, '../dummy/sample.env'));
    let envArray = env.toString().split("\n");
    envArray.splice( envArray.indexOf('#APP BASIC') + 1, 0, `APP_NAME=${package.name}\nAPP_VERSION=${package.version}\nAPP_DESCRIPTION=${(package.description === '') ? package.name + ' description' : package.description }` );
    fs.writeFileSync(`${ outputDir }/.env`, envArray.join('\n'));
    fs.unlinkSync(`${ outputDir }/sample.env`)

    console.log("Installing Dependencies");
    const npmInstall = shell.exec(`cd ${outputDir} && npm install && cd ${currentDir}`)
    if(npmInstall.code !== 0) {
        return -1;
    }
}
module.exports = createProject;
