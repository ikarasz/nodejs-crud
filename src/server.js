import express from 'express';
import './common/environment.js';

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
