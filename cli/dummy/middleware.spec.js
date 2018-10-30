const { assert } = require('chai');
const httpMocks = require('node-mocks-http');

const MIDDLEWARE = require('./MIDDLEWARE');

describe('MIDDLEWARE middleware check', () => {
    it('Check MIDDLEWARE middleware', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/',
        });
        const response = httpMocks.createResponse();

        MIDDLEWARE(request, response, () => assert.ok(true));
    });
});
