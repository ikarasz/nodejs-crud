import db from '../../db/models/index.js';

async function connect() {
  try {
    await db.sequelize.authenticate();
  } catch (err) {
    console.log('Cannot establish db connection: ', err);
    throw new Error('Database connection has been refused');
  }
}

export default {
  connect,
};
