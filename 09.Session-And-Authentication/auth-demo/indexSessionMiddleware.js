import express from 'express';
import config from './config/config.js';
import expressConfig from './config/express.js';
import mongooseConfig from './config/mongoose.js';
import Session from './models/Session.js';

const app = express();
expressConfig(app);
mongooseConfig(app);

app.get('/', (req, res) => {
    const username = req.session?.username;
    const coko = req.session?.coko || '------';
    const car = req.session?.car || 'No car!';
    res.send(`<h1>Hello ${username || 'n/a'}!</h1> <h1>My coko: ${coko}</h1> <h1>My car: ${car}</h1>`);
});

app.get('/login/:username', (req, res) => {
    const username = req.params?.username;
    if (username) Session.findByIdAndUpdate(req.session.id, { username }, { useFindAndModify: false })
        .then(x => res.send('You have been logged!'));
    else res.redirect('/');
});

app.get('/coko/:moko', (req, res) => {
    const coko = req.params.moko;
    if (coko) Session.findByIdAndUpdate(req.session.id, { coko }, { useFindAndModify: false })
        .then(x => res.redirect('/'));
    else res.redirect('/');
})

app.get('/car/:car', (req, res) => {
    const car = req.params.car;
    if (car) Session.findByIdAndUpdate(req.session.id, { car }, { useFindAndModify: false })
        .then(x => res.redirect('/'));
    else res.redirect('/');
})

app.get('/show', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    res.send(cookies);

});

app.get('/session', (req, res) => res.send(req.session));

app.listen(config.PORT, x => console.log(`Server is listening on port ${config.PORT}...`));