import db from '../common/db.js';

async function isDBAccessible() {
  try {
    const { done } = await db.connect();
    done();
    return true;
  } catch (err) {
    return false;
  }
}

export default {
  isDBAccessible,
};
