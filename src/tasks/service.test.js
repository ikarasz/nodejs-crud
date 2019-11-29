import sinon from 'sinon';
import { expect } from 'chai';

import service from './service.js';
import storage from './storage.js';

describe('tasks service [createTask]', () => {
  function shouldThrowErrorWith(testTask, done) {
    const dummyUserId = 10;
    const storageSpy = sinon.spy(storage, 'saveTask');

    service.createTask(dummyUserId, testTask)
      .then(() => {
        done(new Error('Didn\'t throw error'));
      })
      .catch((err) => {
        expect(err.message).to.equal('invalid_task');
        expect(storageSpy.notCalled).to.equal(true);
        done();
      });
  }

  it('should validate name', (done) => {
    shouldThrowErrorWith({
      description: 'task description',
      dateTime: '2016-05-25 14:25:00',
    }, done);
  });

  it('should validate description', (done) => {
    shouldThrowErrorWith({
      name: 'task name',
      dateTime: '2016-05-25 14:25:00',
    }, done);
  });

  it('should validate empty date time', (done) => {
    shouldThrowErrorWith({
      name: 'task name',
      description: 'task description',
    }, done);
  });

  it('should validate malformed date time', (done) => {
    shouldThrowErrorWith({
      name: 'task name',
      description: 'task description',
      dateTime: 'invalid date',
    }, done);
  });

  it('should reject if storage rejects', (done) => {
    sinon.stub(storage, 'saveTask').rejects(new Error('dummy_error'));
    const dummyUserId = 200;
    const dummyTask = {
      name: 'task name',
      description: 'task description',
      dateTime: '2016-05-25 14:25:00',
    };

    service.createTask(dummyUserId, dummyTask)
      .then(() => {
        done(new Error('Didn\'t throw error'));
      })
      .catch((err) => {
        expect(err.message).to.equal('dummy_error');
        done();
      });
  });

  it('should call storage properly', async () => {
    const dummyUserId = 300;
    const dummyTask = {
      name: 'a',
      description: 'b',
      dateTime: '2017-03-14 23:11:18',
    };
    const expectedArgs = {
      userId: dummyUserId,
      name: 'a',
      description: 'b',
      dateTime: new Date('2017-03-14 23:11:18Z'),
    };

    const updateMock = sinon.mock(storage).expects('saveTask')
      .withExactArgs(expectedArgs)
      .resolves(true);

    await service.createTask(dummyUserId, dummyTask);

    updateMock.verify();
  });

  it('should return item from storage', async () => {
    const expected = {};
    const dummyUserId = 222;
    const dummyTask = {
      name: 'a',
      description: 'b',
      dateTime: '2014-08-20 10:56:02',
    };

    sinon.stub(storage, 'saveTask').resolves(expected);

    const actual = await service.createTask(dummyUserId, dummyTask);

    expect(actual).to.equal(expected);
  });

  afterEach(() => storage.saveTask.restore());
});
