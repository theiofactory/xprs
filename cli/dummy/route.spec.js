const integration = require('mocha-axios');
const app = require('../../build/bin/www');

describe('', () => {
    it('', () => {
        integration({
            app,
            req: {
                method: 'GET',
                url: '/',
            },
            res: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {},
            },
        })();
    });
});
