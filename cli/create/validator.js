const fs = require('fs');
const path = require('path');

const validation = {
    isIOExpress: function() {
        return new Promise(function(resolve, reject) {
            const controllerPath = path.join(process.cwd(), '/src/controllers');
            const handlerPath = path.join(process.cwd(), '/src/handlers');
            const middlewarePath = path.join(process.cwd(), '/src/middlewares');
            const modelsPath = path.join(process.cwd(), '/src/models');
            const routesPath = path.join(process.cwd(), '/src/routes');
            return (
                fs.existsSync(controllerPath) && fs.existsSync(handlerPath) &&
                fs.existsSync(middlewarePath) && fs.existsSync(modelsPath) &&
                fs.existsSync(routesPath)
            ) ? resolve(true) : reject(false);
        });
    },
    ioExpressDirectoryExists: function(type, directoryName) {
        return new Promise(function(resolve, reject) {
            const directoryPath = path.join(process.cwd(), '/src', type, directoryName);
            return (fs.existsSync(directoryPath)) ? resolve(true) : reject(false);
        });
    },
    ioExpressFileExists: function(type, directoryName, fileName) {
        return new Promise(function(resolve, reject) {
            const filePath = path.join(process.cwd(), '/src', type, directoryName, fileName);
            return (fs.existsSync(filePath)) ? resolve(true) : reject(false);
        });
    }
}

module.exports = validation;
