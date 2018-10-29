const { assert } = require('chai');
const httpMocks = require('node-mocks-http');

const CONTROLLER = require('./CONTROLLER');

describe('Controller check', () => {
    it('Check Controller', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/',
        });
        const response = httpMocks.createResponse();

        CONTROLLER(request, response);

        assert.equal(200, response.statusCode);
        assert.ok(response._isEndCalled());
    });
});
