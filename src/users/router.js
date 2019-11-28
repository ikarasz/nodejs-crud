import express from 'express';
import controller from './controller.js';

const router = express.Router();

router.use(express.json());

router.get('/', controller.listUsers);
router.post('/', controller.createUser);
router.all('/', (req, res) => {
  res.status(405);
  res.send({ error: 'Method not allowed' });
});

router.get('/:id(\\d+)', controller.getUser);
router.put('/:id(\\d+)', controller.updateUser);
router.all('/:id(\\d+)', (req, res) => {
  res.status(405);
  res.send({ error: 'Method not allowed' });
});

export default router;
