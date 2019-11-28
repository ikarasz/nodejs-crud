import userService from './service.js';
import {
  INCOMPLETE_USER,
  DUPLICATE_USER,
} from '../common/errors.js';

function getPublicErrorInfo({ message: errorMessage }) {
  let status = 500;
  let message = 'Internal error';

  if (INCOMPLETE_USER === errorMessage) {
    status = 400;
    message = 'Invalid user';
  } else if (DUPLICATE_USER === errorMessage) {
    status = 409;
    message = 'Registered username';
  }

  return { status, message };
}

async function createUser(req, res) {
  const {
    username,
    first_name: firstName,
    last_name: lastName,
  } = req.body;

  try {
    const user = await userService.createUser({ username, firstName, lastName });
    res.status(201);
    res.links({ resource: `${req.originalUrl}/${user.id}` });
    res.send({
      id: user.id,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
    });
  } catch (err) {
    const { status, message: error } = getPublicErrorInfo(err);
    res.status(status).send({ error });
  }
}

export default {
  createUser,
};
