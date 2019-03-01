const { exec } = require('child_process');

const Validator = require('./../create/validator');

module.exports = async () => {
    try {
        await Validator.isIOExpress();
        try {
            exec('node buildSwaggerDoc.js', { cwd: process.cwd() }, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    console.log(stdout);
                    console.log(stderr);
                }
                console.log('Swagger docs built successfully');
            });
        } catch (err) {
            throw new Error(err);
        }
    } catch (err) {
        console.log(err);
        console.log(`Run 'xprs create' command from a valid 'IO Express' project root!`);
        return -1;
    }
}
