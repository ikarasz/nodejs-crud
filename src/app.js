import express from 'express';
import heartbeatRouter from './heartbeat/router.js';

const app = express();

app.use('/heartbeat', heartbeatRouter);

app.get('/', (req, res) => {
  res.send({
    heartbeat: '/heartbeat',
  });
});

app.all('*', (req, res) => {
  res.sendStatus(404);
});

export default app;
