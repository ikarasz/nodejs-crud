import userService from './service.js';
import {
  STORAGE_ERROR,
  INCOMPLETE_USER,
  DUPLICATE_USER,
} from '../common/errors.js';

function handleError({ message }, res) {
  switch (message) {
    case INCOMPLETE_USER:
      return res.sendStatus(400);
    case DUPLICATE_USER:
      return res.sendStatus(409);
    case STORAGE_ERROR:
    default:
      return res.sendStatus(500);
  }
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
    res.send(user);
  } catch (err) {
    handleError(err, res);
  }
}

export default {
  createUser,
};
