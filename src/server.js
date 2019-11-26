import express from 'express';
import '../environment.js';
import decorateApp from './routes.js';

const PORT = process.env.PORT || 3000;
const app = express();

decorateApp(app);

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
