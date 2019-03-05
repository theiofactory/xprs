const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    plugins: [
        'plugins/markdown',
        'plugins/summarize',
    ],
    recurseDepth: 10,
    source: {
        include: ['src/', 'README.md'],
        exclude: ['node_modules'],
        includePattern: '.js$',
        excludePattern: '(node_modules/|docs)',
    },
    tags: {
        allowUnknownTags: true,
        dictionaries: ['jsdoc', 'closure'],
    },
    templates: {
        referenceTitle: process.env.APP_NAME,
        disableSort: false,
        collapse: true,
        resources: {
            express: 'https://expressjs.com/en/4x/api.html',
            mocha: 'https://mochajs.org',
            iofactory: 'https://iofactory.in',
        },
    },
    opts: {
        destination: process.env.JSDOC_DESTINATION,
        encoding: 'utf8',
        private: true,
        recurse: true,
        template: './jsdoc-template',
    },
};
