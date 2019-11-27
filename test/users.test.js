import request from 'supertest';
import app from './setup';

import models from '../db/models/index.js';

describe('[POST] /api/users', () => {
  let server;

  function shouldSendStatusAndMessageFor(status, message, testUser, done) {
    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(testUser)
      .expect('Content-Type', /json/)
      .expect(status, {
        error: message,
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  }

  before((done) => {
    server = app.listen((err) => (err ? done(err) : done()));
  });

  after(() => server.close());

  beforeEach(async () => {
    await models.User.sync();
    await models.User.create({
      username: 'jacko',
      firstName: 'Michael',
      lastName: 'Jackson',
    });
  });

  afterEach(async () => {
    await models.User.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });
  });

  it('should validate username', (done) => {
    shouldSendStatusAndMessageFor(400, 'invalid user', {
      first_name: 'a',
      last_name: 'b',
    }, done);
  });

  it('should validate first_name', (done) => {
    shouldSendStatusAndMessageFor(400, 'invalid user', {
      username: 'a',
      last_name: 'b',
    }, done);
  });

  it('should validate last_name', (done) => {
    shouldSendStatusAndMessageFor(400, 'invalid user', {
      username: 'a',
      first_name: 'b',
    }, done);
  });

  it('should check duplications', (done) => {
    shouldSendStatusAndMessageFor(409, 'registered username', {
      username: 'jacko',
      first_name: 'a',
      last_name: 'b',
    }, done);
  });

  it('should create user if everything is ok', (done) => {
    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send({
        username: 'a',
        first_name: 'b',
        last_name: 'c',
      })
      .expect('Content-Type', /json/)
      .expect(201, {
        id: 2,
        username: 'a',
        first_name: 'b',
        last_name: 'c',
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
