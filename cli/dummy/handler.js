/**
 * @function
 * @name Handler
 * @description Handler description.
 * @callback next
 * @param {Object} error - Error object description.
 * @param {Object} request - Request object description.
 * @param {Object} response - Response object description.
 * @param {next} next - next function.
 *
 * @return {Function} next function.
*/
module.exports = (error, request, response, next) => {
    return next();
};
