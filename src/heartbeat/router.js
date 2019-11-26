import express from 'express';
import service from './service.js';

const router = express.Router();

router.get('/', async (req, res) => res.send({
  db: Number(await service.isDBAccessible()),
}));

router.all('/', (req, res) => res.sendStatus(405));

export default router;
