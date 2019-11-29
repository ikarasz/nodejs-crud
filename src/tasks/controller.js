import taskService from './service.js';
import { INCOMPLETE_TASK, NOT_FOUND, TASK_OWNER_NOT_FOUND } from '../common/errors.js';

const formatDate = (date) => date
  .toJSON()
  .replace('T', ' ')
  .substring(0, 19);

function getPublicErrorInfo({ message: errorMessage }) {
  let status = 500;
  let message = 'Internal error';

  if (INCOMPLETE_TASK === errorMessage) {
    status = 400;
    message = 'Invalid task';
  } else if (TASK_OWNER_NOT_FOUND === errorMessage) {
    status = 404;
    message = 'Owner not found';
  }

  return { status, message };
}

async function createTask(req, res) {
  const { name, description, date_time: dateTime } = req.body;
  const userId = parseInt(req.params.userId, 10);

  try {
    const task = await taskService.createTask(userId, {
      name,
      description,
      dateTime: new Date(dateTime),
    });

    res.status(201);
    res.links({ resource: `${req.originalUrl}/${task.id}` });
    res.send({
      id: task.id,
      name: task.name,
      description: task.description,
      date_time: formatDate(task.dateTime),
    });
  } catch (err) {
    const { status, message: error } = getPublicErrorInfo(err);
    res.status(status).send({ error });
  }
}

export default {
  createTask,
};
