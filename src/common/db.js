import pgPromise from 'pg-promise';

const pgp = pgPromise({ noLocking: true });

export default pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
