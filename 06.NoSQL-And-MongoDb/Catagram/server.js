import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import checkMatIdMiddleware from './middlewares/matIdMiddleware.js';
import loggerMiddleware from './middlewares/loggerMiddleware.js';
import handlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import cats from './cats.mjs';
import mongoose from 'mongoose';
import db from './config/db.js';
import createCat from './services/createCat.js';
import Cat from './modules/Cat.js';

const app = express();
const port = 5000;
// const cats = [];

app.use('/static', express.static('public'));
// app.use(express.static('public'));
app.use(loggerMiddleware);

app.engine('hbs', handlebars({ extname: 'hbs' }));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));

// app.get('/', (req, res) => { res.status(200); res.send('Hello world from Express.js!') });
// app.get('/', (req, res) => { res.status(200); res.sendFile('./public/index.html', { root: __dirname }); });
app.get('/', (req, res) => {

    // createCat('Freddy', 'Asennn');
    // Cat.find({ name: 'Freddy' }).populate('owner')
    Cat.find({ name: 'Freddy' }).populate({
        path: 'owner', match: { age: { $gte: 29 } }, select: 'name', options: { limit: 3 }
    })
        .then(x => {
            // console.log(`Cat ${x[0].name} has owner ${x[0].owner.name}!`);
            console.log(x);

            let name = 'Pesho';
            let title = 'All about <p> Tags';
            res.status(200).render('home', { name, title });
        });
});

// app.get('/cats', (req, res) => { console.log('get cats'); res.send('cats received!') })
//    .post('/cats', (req, res) => { console.log('create cat'); res.status(201).send('cat created!') });
app.route('/cats')
    // .get((req, res) => { console.log('get cats'); res.send('cats received!') })
    // .get((req, res) => res.json(['Navcho', 'Garry', 'Mishi']))
    .get((req, res) => res.render('cats', { cats: cats.getAll(), input: 'You know everything about <HTML>!' }))
    .post((req, res) => {
        // res.status(201).send('cat created!')
        console.log(`Request payload: ${JSON.stringify(req.body)};`);
        cats.add(req.body.cat);
        res.redirect('/cats');
    })
    .delete((req, res) => console.log('delete'));

app.route('/cats/:id')
    .get((req, res) => {
    const id = req.params.id;
    console.log(`get cat with id: ${id}`);
    res.send(`cat with id: ${id} received`)
})
    .put((req, res) => {
    const id = req.params.id;
    console.log(`update cat with id: ${id}`);
    res.send(`cat with id: ${id} updated`)
    });

app.route('/mats/:matId?')
    .get(checkMatIdMiddleware, (req, res) => {
    const id = req.params.matId;
    console.log(`get mat with matId: ${id}`);
    res.send(`mat with matId: ${id} received`)
})

app.get('/users/:usersId', (req, res) => { const paramsObj = req.params; res.send(paramsObj) });
app.get('/users/:userId/:userAge', (req, res) => { const paramsObj = req.params; res.send(paramsObj) });
app.get('/musers', (req, res) => { const paramsObj = req.params; res.send(paramsObj) });
app.get('/numbers/:numberId(\\d+)', (req, res) => { const paramsObj = req.params; res.send(paramsObj) });
app.get('/mumbers/:mumberId', (req, res) => {
    if (!/^\d+$/.test(req.params.mumberId)) return res.status(404).send('You need specify cat id number!');
    res.send(req.params);
});

app.all('/about',
    (req, res, next) => { console.log('Middleware execution...'); next(); },
    (req, res) => { res.status(200); res.send('Show about page.'); });

app.get('/ab/*/cde?', (req, res) => res.send('abcd, ab/ANYTHING/cd'));
app.get('/ab+cd', (req, res) => res.send('abcd, abB+cd'));
app.get('/ab*cd', (req, res) => res.send('abcd, abANYTHINGcd'));
app.get(/.*fly$/, (req, res) => res.send('ANYTHINGfly'));

app.get('/download', (req, res) => res.download('./public/cats.html'));
app.get('/attachement', (req, res) => { res.attachment('./public/cats.html'); res.end(); });

// app.get('/sendFile', (req, res) => res.sendFile(`${__dirname}/public/cats.html`));
// app.get('/sendFile', (req, res) => res.sendFile('./public/cats.html', { root: __dirname }));
app.get('/sendFile', (req, res) => res.sendFile('./public/pdf/home.pdf', { root: __dirname }));
app.get('/redirect', (req, res) => res.redirect('/'));
app.get('/favicon.ico', (req, res) => res.redirect('/static/assets/favicon.ico'));

app.get('*', (req, res) => res.send('Matches everything'));
app.listen(port, () => console.log(`Server is running on port ${port}...`));