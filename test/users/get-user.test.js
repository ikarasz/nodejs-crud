import request from 'supertest';
import sinon from 'sinon';
import app from '../setup';

import models from '../../db/models/index.js';

describe('[GET] /api/users/:id', () => {
  let server;

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

  it('should handle db errors', (done) => {
    sinon.stub(models.User, 'findOne').rejects();

    request(app)
      .get('/api/users/1')
      .expect('Content-Type', /json/)
      .expect(500, { error: 'Internal error' })
      .end((err) => {
        models.User.findOne.restore();
        if (err) return done(err);
        return done();
      });
  });

  it('should return 404 if user is not found', (done) => {
    request(app)
      .get('/api/users/2')
      .expect('Content-Type', /json/)
      .expect(404, { error: 'User not found' })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should return user if everything is ok', (done) => {
    request(app)
      .get('/api/users/1')
      .expect('Content-Type', /json/)
      .expect(200, {
        id: 1,
        username: 'jacko',
        first_name: 'Michael',
        last_name: 'Jackson',
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
