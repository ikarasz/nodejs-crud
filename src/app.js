import express from 'express';
import heartbeatRouter from './heartbeat/router.js';

const server = express();

server.use('/heartbeat', heartbeatRouter);

server.get('/', (req, res) => {
  res.send({
    heartbeat: '/heartbeat',
  });
});

server.all('*', (req, res) => {
  res.sendStatus(404);
});

export default server;
