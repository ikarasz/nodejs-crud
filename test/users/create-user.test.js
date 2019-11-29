import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import app from '../setup';

import models from '../../db/models/index.js';

describe('[POST] /api/users', () => {
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
  ) {
    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(testReqBody)
      .expect('Content-Type', /json/)
      .expect(expectedStatus, expectedBody)
      .end((err, res) => {
        if (beforeDone) beforeDone(res);
        if (err) return done(err);
        return done();
      });
  }

  it('should validate username', (done) => {
    const expectedStatus = 400;
    const expectedResponseBody = { error: 'Invalid user' };
    const testRequestBody = {
      first_name: 'a',
      last_name: 'b',
    };

    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
    );
  });

  it('should validate first_name', (done) => {
    const expectedStatus = 400;
    const expectedResponseBody = { error: 'Invalid user' };
    const testRequestBody = {
      username: 'a',
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
      username: 'a',
      first_name: 'b',
    };

    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
    );
  });

  it('should check duplications', (done) => {
    const expectedStatus = 409;
    const expectedResponseBody = { error: 'Registered username' };
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
    );
  });

  it('should handle db errors', (done) => {
    sinon.stub(models.User, 'create').rejects();

    function beforeDone() {
      models.User.create.restore();
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

  it('should create user if everything is ok', (done) => {
    const expectedStatus = 201;
    const testRequestBody = {
      username: 'a',
      first_name: 'b',
      last_name: 'c',
    };
    const expectedResponseBody = {
      id: 2,
      ...testRequestBody,
      tasks: '/api/users/2/tasks',
    };

    function extraChecks(res) {
      expect(res.get('Link')).to
        .be.a('string', 'Links header is set');
      expect(res.get('Link')).to
        .include('/api/users/2', 'Contains the created resource\'s location');
    }

    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
      extraChecks,
    );
  });
});
