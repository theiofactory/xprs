const { exec } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');

const Validator = require('./../create/validator');

dotenv.config({ path: path.join(process.cwd(), '.env') });

module.exports = async () => {
    try {
        await Validator.isIOExpress();
        try {
            exec(`node ${path.join(__dirname, 'swagger.config.js')}`, {cwd: process.cwd()}, (err, stdout, stderr) => {
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
