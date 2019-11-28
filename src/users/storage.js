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

async function updateUser(id, userData) {
  try {
    const [updated] = await models.User.update(userData, {
      where: { id },
      fields: Object.keys(userData),
    });
    return updated !== 0;
  } catch (err) {
    log('Cannot update user: ', { id, userData, err });
    throw new Error(STORAGE_ERROR);
  }
}

async function getUser(id) {
  try {
    return await models.User.findOne({ where: { id } });
  } catch (err) {
    log('Cannot retrieve user: ', { id, err });
    throw new Error(STORAGE_ERROR);
  }
}

export default {
  saveUser,
  updateUser,
  getUser,
};
