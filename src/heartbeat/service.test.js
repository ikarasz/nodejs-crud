import sinon from 'sinon';
import { expect } from 'chai';

import db from '../common/db';
import service from './service';

describe('heartbeat service', () => {
  it('should return true if db is accessible', async () => {
    const doneSpy = sinon.spy();
    sinon.stub(db, 'connect').resolves({ done: doneSpy });

    const actual = await service.isDBAccessible();

    expect(actual).to.equal(true);
    expect(doneSpy.calledOnce).to.equal(true);
  });

  it('should return false if db is not accessible', async () => {
    sinon.stub(db, 'connect').rejects();

    const actual = await service.isDBAccessible();

    expect(actual).to.equal(false);
  });

  afterEach(() => db.connect.restore());
});
