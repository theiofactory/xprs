const { assert } = require('chai');
const httpMocks = require('node-mocks-http');

const MIDDLEWARE = require('./MIDDLEWARE');

describe('Dummy middleware check', () => {
    it('Check dummy middleware', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/',
        });
        const response = httpMocks.createResponse();

        MIDDLEWARE(request, response, () => assert.ok(true));
    });
});
