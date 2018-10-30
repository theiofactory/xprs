const fs = require('fs');
const path = require('path');

const Validator = require('./validator');

async function createOthers(type, name) {
    try {
        await Validator.isIOExpress();
        try {
            await Validator.ioExpressFileExists((type[type.length-1] !== 's') ? type.charAt(0).toUpperCase() + type.slice(1) + 's' : type.charAt(0).toUpperCase() + type.slice(1), '', `${name}.${type}.js`);
            console.log(`You are trying to create a ${type} that already exists.`);
            return -1;
        } catch (e) {
            let dummyFile = fs.readFileSync(path.join(__dirname, '../dummy', `${type}.js`)).toString();
            let dummyFileTest = fs.readFileSync(path.join(__dirname, '../dummy', `${type}.spec.js`)).toString();
            if (type === 'middleware') {
                dummyFile = dummyFile.replace(/MIDDLEWARE/g, name);
                dummyFileTest = dummyFileTest.replace(/MIDDLEWARE/g, name);
                dummyFileTest = dummyFileTest.replace(`./${ name }`, `./${ name }.middleware`);
            }
            if (type === 'model') {
                dummyFile = dummyFile.replace('schemaName', name);
                dummyFileTest = dummyFileTest.replace(/MODEL/g, name);
                dummyFileTest = dummyFileTest.replace(`./${name}`, `./${name}.model`);
                dummyFileTest = dummyFileTest.replace(/TESTNAME/g, `${name.charAt(0).toUpperCase() + name.slice(1)}Model`);
                dummyFileTest = dummyFileTest.replace(/NEWDATA/g, `new${name.charAt(0).toUpperCase() + name.slice(1)}Model`);
            }
            fs.writeFileSync(path.join(process.cwd(), 'src', type + 's', `${name}.${type}.js`), dummyFile)
            fs.writeFileSync(path.join(process.cwd(), 'src', type + 's', `${name}.${type}.spec.js`), dummyFileTest)
            console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} created      : src/${type}s/${name}.${type}.js`);
            console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} Test created : src/${type}s/${name}.${type}.spec.js`);
            return -1;
        }
    } catch (e) {
        console.log(`Run 'xprs create' command from a valid 'IO Express' project root!`);
        return -1;
    }
}

module.exports = createOthers;
