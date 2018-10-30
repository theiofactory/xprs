const fs = require('fs');
const inquirer = require('inquirer');
const validate = require("validate-npm-package-name");
const path = require('path');
const createProject = require('./createProject');

const questions = function(name) {
    return [
        {
            type: 'input',
            name: 'name',
            message: 'Name',
            default: name,
            validate: function (input) {
                const valid = validate(input);
                if(!valid.validForNewPackages) {
                    return valid.errors[0];
                } else {
                    const exists = fs.existsSync(path.join(process.cwd(), input));
                    if (exists) {
                        return "Choose a different name as a directory exists with the same name."
                    }
                    return true
                }
            }
        },
        {
            type: 'input',
            name: 'version',
            message: 'Version',
            default: '1.0.0'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Description',
            default: ''
        },
        {
            type: 'input',
            name: 'repository',
            message: 'Repository',
        },
        {
            type: 'input',
            name: 'author',
            message: 'Author',
        },
        {
            type: 'input',
            name: 'license',
            message: 'License',
            default: 'UNLICENSED'
        },
        {
            type: 'confirm',
            name: 'private',
            message: 'Private',
            default: 'Y'
        }
    ];
}

module.exports = function newCommand(name) {
    inquirer.prompt(questions(name)).then(function(answer) {
        createProject(answer);
    })
}