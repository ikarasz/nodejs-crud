import storage from './storage.js';
import {
  INCOMPLETE_USER,
} from '../common/errors.js';

async function createUser({ username, firstName, lastName }) {
  if (!(username && firstName && lastName)) {
    throw new Error(INCOMPLETE_USER);
  }

  return storage.saveUser({ username, firstName, lastName });
}

export default {
  createUser,
};
