import sinon from 'sinon';
import { expect } from 'chai';

import service from './service.js';
import storage from './storage.js';

describe('heartbeat service', () => {
  it('should return true if db is accessible', async () => {
    sinon.stub(storage, 'connect').resolves();

    const actual = await service.isDBAccessible();

    expect(actual).to.equal(true);
  });

  it('should return false if db is not accessible', async () => {
    sinon.stub(storage, 'connect').rejects();

    const actual = await service.isDBAccessible();

    expect(actual).to.equal(false);
  });

  afterEach(() => storage.connect.restore());
});
