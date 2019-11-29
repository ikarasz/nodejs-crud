import express from 'express';
import controller from './controller.js';

const router = express.Router({ mergeParams: true });

router.use(express.json());

router.post('/', controller.createTask);

export default router;
