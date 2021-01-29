import express from 'express';
import config from './config/config.js';
import expressConfig from './config/express.js';
import routes from './router.js';

const app = express();
expressConfig(app);
app.use(routes);

app.listen(config.PORT, () => console.log(`Server is running on port ${config.PORT}...`));


