import models from '../../db/models/index.js';
import { STORAGE_ERROR, TASK_OWNER_NOT_FOUND } from '../common/errors.js';
import userStorage from '../users/storage.js';
import log from '../common/logger.js';

async function saveTask(taskDetails) {
  try {
    const owner = await userStorage
      .getUser(taskDetails.userId);

    if (owner === null) {
      throw new Error(TASK_OWNER_NOT_FOUND);
    }

    const task = await models.Task.create(taskDetails);
    await task.setOwner(owner);
    return task;
  } catch (err) {
    log('Cannot insert task: ', { taskDetails, err });
    const errorMessage = err.message === TASK_OWNER_NOT_FOUND
      ? TASK_OWNER_NOT_FOUND
      : STORAGE_ERROR;

    throw new Error(errorMessage);
  }
}

export default {
  saveTask,
};
