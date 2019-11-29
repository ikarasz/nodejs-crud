import fs from 'fs';
import path, { dirname } from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath } from 'url';

import config from '../config/config.js';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);

const basename = path.basename(__filename);

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => (
    file.indexOf('.') !== 0
    && (file !== basename)
    && (file.slice(-3) === '.js')
  ));

Promise.all(
  modelFiles.map(async (file) => {
    const { default: modelCreator } = await import(path.join(__dirname, file));
    const model = modelCreator(sequelize, Sequelize);
    db[model.name] = model;
    return model;
  }),
).then(
  (models) => models
    .filter((model) => model.associate)
    .forEach((model) => model.associate(db)),
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
