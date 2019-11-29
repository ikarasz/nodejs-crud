import storage from './storage.js';
import { INCOMPLETE_TASK } from '../common/errors.js';

async function createTask(userId, { name, description, dateTime }) {
  const dueDate = new Date(`${dateTime}Z`);

  // eslint-disable-next-line no-restricted-globals
  if (!(name && description && dateTime) || isNaN(dueDate)) {
    throw new Error(INCOMPLETE_TASK);
  }

  return storage.saveTask({
    userId,
    name,
    description,
    dateTime: dueDate,
  });
}

export default {
  createTask,
}
