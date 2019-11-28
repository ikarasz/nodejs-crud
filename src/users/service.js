import storage from './storage.js';
import {
  INCOMPLETE_USER, NOT_FOUND,
} from '../common/errors.js';

async function createUser({ username, firstName, lastName }) {
  if (!(username && firstName && lastName)) {
    throw new Error(INCOMPLETE_USER);
  }

  return storage.saveUser({ username, firstName, lastName });
}

async function updateUser(userId, { firstName, lastName }) {
  if (!(firstName && lastName)) {
    throw new Error(INCOMPLETE_USER);
  }

  const hasBeenFound = await storage.updateUser(userId, { firstName, lastName });

  if (!hasBeenFound) {
    throw new Error(NOT_FOUND);
  }

  return storage.getUser(userId);
}

export default {
  createUser,
  updateUser,
};
