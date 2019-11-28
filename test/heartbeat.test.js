import request from 'supertest';
import sinon from 'sinon';
import db from '../db/models/index.js';
import app from './setup';

describe('[GET] /heartbeat with working ENV vars', () => {
  let server;

  beforeEach((done) => {
    server = app.listen((err) => (err ? done(err) : done()));
  });

  afterEach(() => server.close());

  it('should confirm the db connection', (done) => {
    request(app)
      .get('/heartbeat')
      .expect('Content-Type', /json/)
      .expect(200, {
        db: 1,
      }, done);
  });

  it('should feedback if storage is not accessible', (done) => {
    sinon.stub(db.sequelize, 'authenticate').rejects();
    request(app)
      .get('/heartbeat')
      .expect('Content-Type', /json/)
      .expect(200, {
        db: 0,
      }, (...args) => {
        db.sequelize.authenticate.restore();
        done(...args);
      });
  });

  it('should send 405 dor unsupported methods', (done) => {
    request(app)
      .post('/heartbeat')
      .expect(405, done);
  });
});
