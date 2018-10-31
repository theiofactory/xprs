const express = require('express');

const CONTROLLER = require('./CONTROLLER');

const router = express.Router();

router.get('/', CONTROLLER);

module.exports = router;
