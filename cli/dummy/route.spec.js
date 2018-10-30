const integration = require('mocha-axios');
const app = require('../../build/bin/www');

describe('check ROUTE route', () => {
    it('Should produce 200', () => {
        integration({
            app,
            req: {
                method: 'GET',
                url: 'ROUTE',
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
