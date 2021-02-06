import express from 'express';
import config from './config/config.js';
import expressConfig from './config/express.js';
import mongoose from 'mongoose';
import mongooseConfig from './config/mongoose.js';
import Session from './models/Session.js';

const app = express();
expressConfig(app);
mongooseConfig(app);

app.get('/', (req, res) => {
    const _id = req.sessionID;
    Session.findById({ _id })
        .then(x => x ? true : (() => {
            const session = new Session({ _id });
            session.save().catch(x => console.log(x.message));
            req.session.user = true;
        })())
        .catch(x => console.log(x.message));
    const username = req.session?.username;
    const coko = req.session?.coko || '------';
    const car = req.session?.car || 'No car!';
    res.send(`<h1>Hello ${username || 'n/a'}!</h1> <h1>My coko: ${coko}</h1> <h1>My car: ${car}</h1>`);
});

app.get('/login/:username', async (req, res) => {
    const username = req.params?.username;
    if (username) {
        if (!req.session.user) {
            const _id = req.sessionID;
            const session = new Session({ _id });
            await session.save().catch(x => console.log(x.message))
            req.session.user = true;
        };
        Session.findByIdAndUpdate(req.sessionID, { username }, { useFindAndModify: false })
            .then(x => { req.session.username = username; res.send('You have been logged!') })
            .catch(x => console.log(x.message));
    }
    else res.redirect('/');
});

app.get('/coko/:moko', async (req, res) => {
    const coko = req.params.moko;
    if (coko) {
        if (!req.session.user) {
            const _id = req.sessionID;
            const session = new Session({ _id });
            await session.save().catch(x => console.log(x.message));
            req.session.user = true;
        };
        Session.findByIdAndUpdate(req.sessionID, { coko }, { useFindAndModify: false })
            .then(x => { req.session.coko = coko; res.redirect('/') });
    } else res.redirect('/');
})

app.get('/car/:car', async (req, res) => {
    const car = req.params.car;
    if (car) {
        if (!req.session.user) {
            const _id = req.sessionID;
            const session = new Session({ _id });
            await session.save().catch(x => console.log(x.message));
            req.session.user = true;
        };
        Session.findByIdAndUpdate(req.sessionID, { car }, { useFindAndModify: false })
            .then(x => { req.session.car = car; res.redirect('/') });
    } else res.redirect('/');
})

app.get('/show', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    res.send(cookies);

});

app.get('/session', (req, res) => res.send(req.session));

app.listen(config.PORT, x => console.log(`Server is listening on port ${config.PORT}...`));