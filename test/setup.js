import express from 'express';
import '../environment';
import decorateApp from '../src/routes';

export default () => {
  const app = express();
  decorateApp(app);
  return app;
};
