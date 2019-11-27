import models from '../../db/models/index.js';
import { STORAGE_ERROR, DUPLICATE_USER } from '../common/errors.js';
import log from '../common/logger.js';

async function saveUser(userDetails) {
  try {
    return await models.User.create(userDetails);
  } catch (err) {
    log('Cannot insert user: ', { userDetails, err });

    const errorMessage = err.name === 'SequelizeUniqueConstraintError'
      ? DUPLICATE_USER
      : STORAGE_ERROR;

    throw new Error(errorMessage);
  }
}

export default {
  saveUser,
};
