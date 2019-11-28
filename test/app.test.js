import request from 'supertest';
import app from './setup';

describe('Default routes', () => {
  let server;

  beforeEach((done) => {
    server = app.listen((err) => (err ? done(err) : done()));
  });

  afterEach(() => server.close());

  it('[GET] / should send the list of available endpoints', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200, {
        heartbeat: '/heartbeat',
        users: '/api/users',
      }, done);
  });

  it('Non-existing route should send 404', (done) => {
    request(app)
      .get('/non-existing')
      .expect(404, done);
  });
});
