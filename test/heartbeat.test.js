import request from 'supertest';
import setup from './setup';

describe('/heartbeat with working ENV vars', () => {
  let app;
  let server;

  beforeEach((done) => {
    app = setup();
    server = app.listen((err) => (err ? done(err) : done()));
  });

  afterEach(() => server.close());

  it('[GET] should confirm the db connection', (done) => {
    request(app)
      .get('/heartbeat')
      .expect('Content-Type', /json/)
      .expect(200, {
        db: 1,
      }, done);
  });

  it('Unsupported method should send 405', (done) => {
    request(app)
      .post('/heartbeat')
      .expect(405, done);
  });
});
