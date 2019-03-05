const express = require('express');

const CONTROLLER = require('./PATH');

const router = express.Router();

router.get('/', CONTROLLER);

module.exports = router;
