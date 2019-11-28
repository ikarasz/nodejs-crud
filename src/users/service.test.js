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

  it('should call storage properly', async () => {
    const dummyUser = {
      username: 'a',
      firstName: 'b',
      lastName: 'c',
    };
    const updateMock = sinon.mock(storage).expects('saveUser')
      .withExactArgs({ ...dummyUser })
      .resolves(true);

    await service.createUser(dummyUser);

    updateMock.verify();
  });

  it('should return item from storage', async () => {
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

describe('users service [updateUser]', () => {
  function shouldThrowErrorWith(testUser, expectedErrorMessage, done) {
    const dummyUserId = 999;
    const updateSpy = sinon.spy(storage, 'updateUser');

    service.updateUser(dummyUserId, testUser)
      .then(() => {
        done(new Error('Didn\'t throw error'));
      })
      .catch((err) => {
        expect(err.message).to.equal(expectedErrorMessage);
        expect(updateSpy.notCalled).to.equal(true);
        done();
      });
  }

  it('should validate firstName', (done) => {
    shouldThrowErrorWith({
      lastName: 'last_name',
    }, 'invalid_user', done);
  });

  it('should validate lastName', (done) => {
    shouldThrowErrorWith({
      firstName: 'first_name',
    }, 'invalid_user', done);
  });

  it('should call storage properly', async () => {
    const dummyUserId = 999;
    const dummyUser = {
      firstName: 'a',
      lastName: 'b',
    };

    sinon.stub(storage, 'getUser').resolves({});

    const updateMock = sinon.mock(storage).expects('updateUser')
      .withExactArgs(dummyUserId, { ...dummyUser })
      .resolves(true);

    await service.updateUser(dummyUserId, dummyUser);

    updateMock.verify();
    storage.getUser.restore();
  });

  it('should handle if no user has been found', (done) => {
    const dummyUserId = 999;
    const dummyUser = {
      firstName: 'a',
      lastName: 'b',
    };
    sinon.stub(storage, 'updateUser').returns(false);

    service.updateUser(dummyUserId, dummyUser)
      .then(() => {
        done(new Error('Didn\'t throw error'));
      })
      .catch((err) => {
        expect(err.message).to.equal('entity_not_found');
        done();
      });
  });

  it('should retrieve user after update', async () => {
    const dummyUserId = 999;
    const dummyUser = {
      firstName: 'a',
      lastName: 'b',
    };

    const expectedResult = {
      dummyKey: 'dummyValue',
    };

    sinon.stub(storage, 'updateUser').resolves(true);
    sinon.stub(storage, 'getUser')
      .withArgs(dummyUserId)
      .resolves(expectedResult);

    const actual = await service.updateUser(dummyUserId, dummyUser);
    expect(actual).to.equal(expectedResult);
    storage.getUser.restore();
  });

  afterEach(() => storage.updateUser.restore());
});

describe('users service [getUsers]', () => {
  it('should reject if storage error occurs', (done) => {
    sinon.stub(storage, 'getUsers').rejects(new Error('storage_error'));
    const dummyFilters = {
      username: 'a',
      firstName: 'b',
      lastName: 'c',
    };

    service.getUsers(dummyFilters)
      .then(() => {
        done(new Error('Didn\'t throw error'));
      })
      .catch((err) => {
        expect(err.message).to.equal('storage_error');
        done();
      });
  });

  it('should call storage w/o filters', async () => {
    const getUsersMock = sinon.mock(storage).expects('getUsers')
      .withExactArgs({})
      .resolves(true);

    await service.getUsers();

    getUsersMock.verify();
  });

  it('should pass filters to storage', async () => {
    const dummyUser = {
      username: 'a',
      lastName: 'c',
    };
    const getUsersMock = sinon.mock(storage).expects('getUsers')
      .withExactArgs({ ...dummyUser })
      .resolves(true);

    await service.getUsers(dummyUser);

    getUsersMock.verify();
  });

  it('should return items from storage', async () => {
    const expected = [{ a: 12, b: 13 }];
    sinon.stub(storage, 'getUsers').resolves(expected);

    const actual = await service.getUsers();

    expect(actual).to.equal(expected);
  });

  afterEach(() => storage.getUsers.restore());
});

describe('users service [getUsers]', () => {
  it('should reject if storage error occurs', (done) => {
    sinon.stub(storage, 'getUser').rejects(new Error('storage_error'));
    const dummyUserId = 22;

    service.getUser(dummyUserId)
      .then(() => {
        done(new Error('Didn\'t throw error'));
      })
      .catch((err) => {
        expect(err.message).to.equal('storage_error');
        done();
      });
  });

  it('should throw error if user is not found', (done) => {
    sinon.stub(storage, 'getUser').resolves(null);
    const dummyUserId = 22;

    service.getUser(dummyUserId)
      .then(() => {
        done(new Error('Didn\'t throw error'));
      })
      .catch((err) => {
        expect(err.message).to.equal('entity_not_found');
        done();
      });
  });

  it('should call storage properly', async () => {
    const dummyUserId = 333;
    const expectedResult = { a: 12, b: 13 };
    const getUserMock = sinon.mock(storage).expects('getUser')
      .withExactArgs(dummyUserId)
      .resolves(expectedResult);

    const actualResult = await service.getUser(dummyUserId);

    getUserMock.verify();
    expect(actualResult).to.equal(expectedResult);
  });

  afterEach(() => storage.getUser.restore());
});
