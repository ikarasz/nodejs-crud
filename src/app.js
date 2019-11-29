import express from 'express';
import heartbeatRouter from './heartbeat/router.js';
import usersRouter from './users/router.js';
import tasksRouter from './tasks/router.js';

const app = express();

app.use('/heartbeat', heartbeatRouter);
app.use('/api/users', usersRouter);
app.use('/api/users/:userId(\\d+)/tasks', tasksRouter);

app.get('/', (req, res) => {
  res.send({
    heartbeat: '/heartbeat',
    users: '/api/users',
  });
});

app.all('*', (req, res) => {
  res.status(404);
  res.send({ error: 'Not found' });
});

app.disable('x-powered-by');

export default app;
