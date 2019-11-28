import express from 'express';
import heartbeatRouter from './heartbeat/router.js';
import usersRouter from './users/router.js';

const app = express();

app.use('/heartbeat', heartbeatRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.send({
    heartbeat: '/heartbeat',
  });
});

app.all('*', (req, res) => {
  res.status(404);
  res.send({ error: 'Not found' });
});

export default app;
