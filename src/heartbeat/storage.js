import db from '../../db/models/index.js';
import log from '../common/logger.js';

async function connect() {
  try {
    await db.sequelize.authenticate();
  } catch (err) {
    log('Cannot establish db connection: ', err);
    throw new Error('Database connection has been refused');
  }
}

export default {
  connect,
};
