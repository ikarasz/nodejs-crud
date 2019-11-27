import '../environment.js';
import app from './app.js';
import log from './common/logger.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => log(`App is listening on ${PORT}`));
