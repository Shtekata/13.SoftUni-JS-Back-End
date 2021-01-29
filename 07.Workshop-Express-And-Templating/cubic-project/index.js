import express from 'express';
import handlebars from 'express-handlebars';
import config from './config/config.js';

const app = express();
app.listen(config.PORT, () => console.log(`Server is running on port ${config.PORT}...`));

app.engine('hbs', handlebars({ extname: 'hbs' }));
app.set('view engine', 'hbs');

app.use(express.static('public'));

app.get('/', (req, res) => res.render('home', { layout: false }));
