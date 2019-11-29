import fs from 'fs';
import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV;
let configFile;

try {
  fs.accessSync(`.env.${nodeEnv}`);
  configFile = `.env.${nodeEnv}`;
} catch (err) {
  configFile = '.env';
}

console.log('Using env file: ', configFile);

dotenv.config({
  path: configFile,
});
