import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import app from '../setup';

import models from '../../db/models/index.js';

describe('[POST] /api/users/:id/tasks', () => {
  let server;

  before((done) => {
    server = app.listen((err) => (err ? done(err) : done()));
  });

  after(() => server.close());

  beforeEach(async () => {
    await models.User.sync();
    await models.Task.sync();
    await models.User.create({
      username: 'jacko',
      firstName: 'Michael',
      lastName: 'Jackson',
    });
    await models.Task.create({
      userId: 1,
      name: 'Figure out a new step',
      description: 'Moon walk would be a cool name',
      dateTime: new Date('2017-12-10 23:11:37Z'),
    });
  });

  afterEach(async () => {
    await models.Task.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });
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
      .post(`/api/users/${userId}/tasks`)
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

  it('should validate name', (done) => {
    const expectedStatus = 400;
    const expectedResponseBody = { error: 'Invalid task' };
    const testRequestBody = {
      description: 'a',
      date_time: '1994-10-11 10:11:11',
    };

    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
    );
  });

  it('should validate description', (done) => {
    const expectedStatus = 400;
    const expectedResponseBody = { error: 'Invalid task' };
    const testRequestBody = {
      name: 'a',
      date_time: '2006-07-20 19:00:00',
    };

    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
    );
  });

  it('should validate empty date time', (done) => {
    const expectedStatus = 400;
    const expectedResponseBody = { error: 'Invalid task' };
    const testRequestBody = {
      name: 'a',
      description: 'b',
    };

    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
    );
  });

  it('should validate malformed date time', (done) => {
    const expectedStatus = 400;
    const expectedResponseBody = { error: 'Invalid task' };
    const testRequestBody = {
      name: 'a',
      description: 'b',
      date_time: 'not a valid date',
    };

    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
    );
  });

  it('should handle if user is not found', (done) => {
    const expectedStatus = 404;
    const expectedResponseBody = { error: 'Owner not found' };
    const testRequestBody = {
      name: 'a',
      description: 'b',
      date_time: '2019-12-11 23:10:56',
    };
    verifyResponse(
      expectedStatus,
      expectedResponseBody,
      testRequestBody,
      done,
      null,
      2,
    );
  });

  it('should handle db errors', (done) => {
    sinon.stub(models.Task, 'create').rejects();

    function beforeDone() {
      models.Task.create.restore();
    }

    const expectedStatus = 500;
    const expectedResponseBody = { error: 'Internal error' };
    const testRequestBody = {
      name: 'fancy task',
      description: 'fancy description',
      date_time: '2001-09-11 09:23:45',
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
      name: 'fancy task',
      description: 'fancy description',
      date_time: '2001-09-11 09:23:45',
    };
    const expectedResponseBody = {
      id: 2,
      ...testRequestBody,
    };

    function extraChecks(res) {
      expect(res.get('Link')).to
        .be.a('string', 'Links header is set');
      expect(res.get('Link')).to
        .include('/api/users/1/tasks/2', 'Contains the created resource\'s location');
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
