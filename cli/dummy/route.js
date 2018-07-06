import express from 'express';

import controller from './controller';

const router = express.Router();

router.use('/', controller);

export default router;
