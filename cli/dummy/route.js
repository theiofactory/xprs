const { Router } = require('express');

const CONTROLLER = require('./CONTROLLER');

const router = new Router();

router.get('/', CONTROLLER);

module.exports = router;
