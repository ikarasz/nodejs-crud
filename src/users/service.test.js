import sinon from 'sinon';
import { expect } from 'chai';

import service from './service.js';
import storage from './storage.js';

describe('users service [createUser]', () => {
  function shouldThrowErrorWith(testUser, done) {
    const storageSpy = sinon.spy(storage, 'saveUser');

    service.createUser(testUser)
      .then(() => {
        done(new Error('Didn\'t throw error'));
      })
      .catch((err) => {
        expect(err.message).to.equal('invalid_user');
        expect(storageSpy.notCalled).to.equal(true);
        done();
      });
  }

  it('should validate username', (done) => {
    shouldThrowErrorWith({
      firstName: 'first_name',
      lastName: 'last_name',
    }, done);
  });

  it('should validate firstName', (done) => {
    shouldThrowErrorWith({
      username: 'uname',
      lastName: 'last_name',
    }, done);
  });

  it('should validate lastName', (done) => {
    shouldThrowErrorWith({
      username: 'uname',
      firstName: 'first_name',
    }, done);
  });

  it('should reject if user is duplicated', (done) => {
    sinon.stub(storage, 'saveUser').rejects(new Error('duplicate_user'));
    const dummyUser = {
      username: 'a',
      firstName: 'b',
      lastName: 'c',
    };

    service.createUser(dummyUser)
      .then(() => {
        done(new Error('Didn\'t throw error'));
      })
      .catch((err) => {
        expect(err.message).to.equal('duplicate_user');
        done();
      });
  });

  it('should reject if storage error occurs', (done) => {
    sinon.stub(storage, 'saveUser').rejects(new Error('storage_error'));
    const dummyUser = {
      username: 'a',
      firstName: 'b',
      lastName: 'c',
    };

    service.createUser(dummyUser)
      .then(() => {
        done(new Error('Didn\'t throw error'));
      })
      .catch((err) => {
        expect(err.message).to.equal('storage_error');
        done();
      });
  });

  it('should call the storage', async () => {
    const expected = {};
    const dummyUser = {
      username: 'a',
      firstName: 'b',
      lastName: 'c',
    };

    sinon.stub(storage, 'saveUser').resolves(expected);

    const actual = await service.createUser(dummyUser);

    expect(actual).to.equal(expected);
  });

  afterEach(() => storage.saveUser.restore());
});
