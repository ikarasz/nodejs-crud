import storage from './storage.js';

async function isDBAccessible() {
  try {
    await storage.connect();
    return true;
  } catch (err) {
    return false;
  }
}

export default {
  isDBAccessible,
};
