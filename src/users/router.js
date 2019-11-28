import express from 'express';
import controller from './controller.js';

const router = express.Router();

router.use(express.json());

router.get('/', controller.listUsers);
router.post('/', controller.createUser);
// router.all('/', (req, res) => res.sendStatus(405));

router.get('/:id(\\d+)', controller.getUser);
router.put('/:id(\\d+)', controller.updateUser);
// router.all('/:id', (req, res) => res.sendStatus(405));

export default router;
