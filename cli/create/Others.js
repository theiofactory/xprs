const fs = require('fs');
const path = require('path');

const Validator = require('./validator');

async function createOthers(type, name) {
    try {
        await Validator.isIOExpress();
        try {
            await Validator.ioExpressFileExists(type, '', `${name}.${type}.js`);
            console.log(`You are trying to create a ${type} that already exists.`);
            return -1;
        } catch (e) {
            let dummyFile = fs.readFileSync(path.join(__dirname, '../dummy', `${type}.js`)).toString();
            if (type === 'models') {
                dummyFile = dummyFile.replace('schemaName', name)
            }
            fs.writeFileSync(path.join(process.cwd(), 'src', type, `${name}.${type}.js`), dummyFile)
            return -1;
        }
    } catch (e) {
        console.log(`Run 'xprs create' command from a valid 'IO Express' project root!`);
        return -1;
    }
}

module.exports = createOthers;
