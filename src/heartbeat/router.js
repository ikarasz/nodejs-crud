import express from 'express';
import controller from './controller.js';

const router = express.Router();

router.get('/', controller.getSystemStatus);
router.all('/', (req, res) => res.sendStatus(405));

export default router;
