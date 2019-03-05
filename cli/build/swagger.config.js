require('dotenv').config();
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const pathsFiles = glob.sync('src/**/*.paths.swagger.json');
const tagsFiles = glob.sync('src/**/*.tags.swagger.json');
const componentsFiles = glob.sync('src/**/*.components.swagger.json');
const definitionsFiles = glob.sync('src/**/*.definitions.swagger.json');
const securityDefinitionsFiles = glob.sync('src/**/*.securityDefinitions.swagger.json');

const swagger = {
    info: {
        title: process.env.APP_NAME,
        version: process.env.APP_VERSION,
        description: process.env.APP_DESCRIPTION,
    },
    host: process.env.SWAGGER_HOST,
    basePath: process.env.SWAGGER_BASE_PATH,
    swagger: '2.0',
    paths: {},
    components: {},
    definitions: {},
    securityDefinitions: {},
    tags: [],
};

const paths = pathsFiles.map((file) => {
    const apiPath = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)).toString());
    return apiPath;
});

const tags = tagsFiles.map((file) => {
    const apiTag = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)).toString());
    return apiTag;
});

const components = componentsFiles.map((file) => {
    const apiComponent = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)).toString());
    return apiComponent;
});

const definitions = definitionsFiles.map((file) => {
    const apiDefinitions = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)).toString());
    return apiDefinitions;
});

const securityDefinitions = securityDefinitionsFiles.map((file) => {
    const apiSecurityDefinitions = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)).toString());
    return apiSecurityDefinitions;
});

swagger.components = (components.length > 0) ? components.reduce((a, v) => ({ ...a, ...v })) : {};
swagger.definitions = (definitions.length > 0) ? definitions.reduce((a, v) => ({ ...a, ...v })) : {};
swagger.tags = (tags.length > 0) ? tags.reduce((a, v) => a.concat(v)) : [];
swagger.paths = (paths.length > 0) ? paths.reduce((a, v) => ({ ...a, ...v })) : {};
swagger.securityDefinitions = (securityDefinitions.length > 0) ? paths.reduce((a, v) => ({ ...a, ...v })) : {};

if (!fs.existsSync(path.join(process.cwd(), 'docs'))) {
    fs.mkdirSync(path.join(process.cwd(), 'docs'));
}
fs.writeFileSync(path.join(process.cwd(), 'docs/swagger.json'), JSON.stringify(swagger, null, 4));
