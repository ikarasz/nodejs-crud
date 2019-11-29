import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import app from '../setup';

import models from '../../db/models/index.js';

describe('[GET] /api/users', () => {
  let server;

  before((done) => {
    server = app.listen((err) => (err ? done(err) : done()));
  });

  after(() => server.close());

  beforeEach(async () => {
    await models.User.sync();
    await models.User.bulkCreate([
      {
        username: 'jacko',
        firstName: 'Michael',
        lastName: 'Jackson',
      },
      {
        username: 'poppp',
        firstName: 'Mary',
        lastName: 'Poppins',
      },
      {
        username: 'wrangler',
        firstName: 'Bruce',
        lastName: 'Lee',
      },
      {
        username: 'jinny',
        firstName: 'Xi',
        lastName: 'Jinping',
      },
    ]);
  });

  afterEach(async () => {
    await models.User.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });
  });

  it('should handle db errors', (done) => {
    sinon.stub(models.User, 'findAll').rejects();

    request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(500, { error: 'Internal error' })
      .end((err) => {
        models.User.findAll.restore();
        if (err) return done(err);
        return done();
      });
  });

  it('should return all items if no filter provided', (done) => {
    request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(4);

        return done();
      });
  });

  it('should ignore extra filters', (done) => {
    request(app)
      .get('/api/users?unknown_field=aaaa')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(4);

        return done();
      });
  });

  it('should filter by full username', (done) => {
    request(app)
      .get('/api/users?username=jacko')
      .expect('Content-Type', /json/)
      .expect(200, [{
        id: 1,
        username: 'jacko',
        first_name: 'Michael',
        last_name: 'Jackson',
        tasks: '/api/users/1/tasks',
      }])
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should filter by partial username', (done) => {
    request(app)
      .get('/api/users?username=a')
      .expect('Content-Type', /json/)
      .expect(200, [{
        id: 1,
        username: 'jacko',
        first_name: 'Michael',
        last_name: 'Jackson',
        tasks: '/api/users/1/tasks',
      }, {
        id: 3,
        username: 'wrangler',
        first_name: 'Bruce',
        last_name: 'Lee',
        tasks: '/api/users/3/tasks',
      }])
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should filter by full first_name', (done) => {
    request(app)
      .get('/api/users?first_name=Xi')
      .expect('Content-Type', /json/)
      .expect(200, [{
        id: 4,
        username: 'jinny',
        first_name: 'Xi',
        last_name: 'Jinping',
        tasks: '/api/users/4/tasks',
      }])
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should filter first_name case insensitively', (done) => {
    request(app)
      .get('/api/users?first_name=xi')
      .expect('Content-Type', /json/)
      .expect(200, [{
        id: 4,
        username: 'jinny',
        first_name: 'Xi',
        last_name: 'Jinping',
        tasks: '/api/users/4/tasks',
      }])
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should filter by partial first_name', (done) => {
    request(app)
      .get('/api/users?first_name=e')
      .expect('Content-Type', /json/)
      .expect(200, [{
        id: 1,
        username: 'jacko',
        first_name: 'Michael',
        last_name: 'Jackson',
        tasks: '/api/users/1/tasks',
      }, {
        id: 3,
        username: 'wrangler',
        first_name: 'Bruce',
        last_name: 'Lee',
        tasks: '/api/users/3/tasks',
      }])
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should filter by full last_name', (done) => {
    request(app)
      .get('/api/users?last_name=Poppins')
      .expect('Content-Type', /json/)
      .expect(200, [{
        id: 2,
        username: 'poppp',
        first_name: 'Mary',
        last_name: 'Poppins',
        tasks: '/api/users/2/tasks',
      }])
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should filter by partial last_name case insensitively', (done) => {
    request(app)
      .get('/api/users?last_name=popp')
      .expect('Content-Type', /json/)
      .expect(200, [{
        id: 2,
        username: 'poppp',
        first_name: 'Mary',
        last_name: 'Poppins',
        tasks: '/api/users/2/tasks',
      }])
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should combine filters', (done) => {
    request(app)
      .get('/api/users?username=o&first_name=m&last_name=s')
      .expect('Content-Type', /json/)
      .expect(200, [
        {
          id: 1,
          username: 'jacko',
          first_name: 'Michael',
          last_name: 'Jackson',
          tasks: '/api/users/1/tasks',
        },
        {
          id: 2,
          username: 'poppp',
          first_name: 'Mary',
          last_name: 'Poppins',
          tasks: '/api/users/2/tasks',
        },
      ])
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
