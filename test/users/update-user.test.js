import request from 'supertest';
import sinon from 'sinon';
import app from '../setup';

import models from '../../db/models/index.js';

describe('[PUT] /api/users/:id', () => {
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


  function verifyResponse(
    expectedStatus,
    expectedBody,
    testReqBody,
    done,
    beforeDone = null,
    userId = 1,
  ) {
    request(app)
      .put(`/api/users/${userId}`)
      .set('Content-Type', 'application/json')
      .send(testReqBody)
      // .expect('Content-Type', /json/)
      .expect(expectedStatus, expectedBody)
      .end((err, res) => {
        if (beforeDone) beforeDone(res);
        if (err) return done(err);
        return done();
      });
  }

  it('should validate first_name', (done) => {
    const expectedStatus = 400;
    const expectedResponseBody = { error: 'Invalid user' };
    const testRequestBody = {
      last_name: 'b',
    };

    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
    );
  });

  it('should validate last_name', (done) => {
    const expectedStatus = 400;
    const expectedResponseBody = { error: 'Invalid user' };
    const testRequestBody = {
      first_name: 'b',
    };

    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
    );
  });

  it('should handle db errors', (done) => {
    sinon.stub(models.User, 'update').rejects();

    function beforeDone() {
      models.User.update.restore();
    }

    const expectedStatus = 500;
    const expectedResponseBody = { error: 'Internal error' };
    const testRequestBody = {
      username: 'jacko',
      first_name: 'a',
      last_name: 'b',
    };

    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
      beforeDone,
    );
  });

  it('should update user if everything is ok', (done) => {
    const expectedStatus = 200;
    const testRequestBody = {
      first_name: 'tom',
      last_name: 'cruise',
    };
    const expectedResponseBody = {
      id: 1,
      username: 'jacko',
      ...testRequestBody,
    };

    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
    );
  });

  it('should not change username', (done) => {
    const expectedStatus = 200;
    const testRequestBody = {
      username: 'tcruise',
      first_name: 'tom',
      last_name: 'cruise',
    };
    const expectedResponseBody = {
      id: 1,
      ...testRequestBody,
      username: 'jacko',
    };

    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
    );
  });

  it('should handle if the user is not found', (done) => {
    const expectedStatus = 404;
    const testRequestBody = {
      first_name: 'tom',
      last_name: 'cruise',
    };
    const expectedResponseBody = {
      error: 'User not found',
    };

    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
      null,
      999,
    );
  });
});
