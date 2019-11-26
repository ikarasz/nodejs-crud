import heartbeatRouter from './heartbeat/router.js';

export default (app) => {
  app.use('/heartbeat', heartbeatRouter);

  app.get('/', (req, res) => {
    res.send({
      heartbeat: '/heartbeat',
    });
  });

  app.all('*', (req, res) => {
    res.sendStatus(404);
  });
};
