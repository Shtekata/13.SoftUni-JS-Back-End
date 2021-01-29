import express from 'express';
import config from './config/config.js';
import expressConfig from './config/express.js';

const app = express();
expressConfig(app);

app.listen(config.PORT, () => console.log(`Server is running on port ${config.PORT}...`));

app.get('/', (req, res) => res.render('home', { layout: false }));
