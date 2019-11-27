import userService from './service.js';
import {
  STORAGE_ERROR,
  INCOMPLETE_USER,
  DUPLICATE_USER,
} from '../common/errors.js';

function handleError({ message }, res) {
  switch (message) {
    case INCOMPLETE_USER:
      res.status(400);
      return res.send({
        error: 'invalid user',
      });
    case DUPLICATE_USER:
      res.status(409);
      return res.send({
        error: 'registered username',
      });
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
    res.send({
      id: user.id,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
    });
  } catch (err) {
    handleError(err, res);
  }
}

export default {
  createUser,
};
