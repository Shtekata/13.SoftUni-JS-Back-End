import express from 'express';
import config from './config/config.js';
import expressConfig from './config/express.js';
import mongooseConfig from './config/mongoose.js';
import Session from './models/Session.js';
import bcrypt from 'bcrypt';

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
    const username = req.session.username;
    const password = req.session.password;
    const coko = req.session?.coko || '------';
    const car = req.session?.car || 'No car!';
    res.send(`<h1>Hello ${username || 'n/a'}!</h1>
    <h1>My pass: ${password}</h1>
    <h1>My coko: ${coko}</h1>
    <h1>My car: ${car}</h1>`);
});

app.get('/register/:username/:password', async (req, res) => {
    const username = req.params.username;
    
    const plainTextPassword = req.params.password;
    const saltRounds = 9;
    const password = await new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (e, x) => {
        if (e) console.log(e.message);
        bcrypt.hash(plainTextPassword, x, (e, x) => {
            if (e) console.log(e.message);
            resolve(x);
        });
    }) 
    });

    if (username) {
        if (!req.session.user) {
            const _id = req.sessionID;
            const session = new Session({ _id });
            await session.save().catch(x => console.log(x.message))
            req.session.user = true;
        };
        Session.findByIdAndUpdate(req.sessionID, { username, password }, { useFindAndModify: false })
            .then(x => {
                req.session.username = username;
                req.session.password = password;
                res.send('You are registered successfully!')
            })
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

app.get('/compare/:password', (req, res) => {
    const hash1 = '$2b$09$fPGeLzA0oLN6CkPvssgLJOwkpmjFuLzEoYzVhrW5VQc7JxpaFgXsG';
    const hash2 = '$2b$09$GM30LYXch/8X2cMpwiEiPutV4hZwhNUrcFmoqzEkf1uGTOUcdM9.2';
    const hash3 = '$2b$09$aKE0ceIOWq782jefL5bV/OfRekid3/9B4I8Mm/O.sws4eYifffTPe';

    const result1 = new Promise((resolve, reject) => {
        bcrypt.compare(req.params.password, hash1, (e, x) => {
            if (e) console.log(e.message);
            resolve(x);
        });
    });
    const result2 = new Promise((resolve, reject) => {
        bcrypt.compare(req.params.password, hash2, (e, x) => {
            if (e) console.log(e.message);
            resolve(x);
        });
    });
    const result3 = new Promise((resolve, reject) => {
        bcrypt.compare(req.params.password, hash3, (e, x) => {
            if (e) console.log(e.message);
            resolve(x);
        });
    });

    Promise.all([result1, result2, result3]).then(x => {
        const result = [];
        x.forEach(x => result.push(x));
        res.send(result);
    });
})

app.get('/login/:password', (req, res) => {
    bcrypt.compare(req.params.password, req.session.password, (e, x) => {
        if (e) console.log(e.message);
        x ? res.send('You are logged!') : res.send('Credentials do not match!');
    })
})

app.listen(config.PORT, x => console.log(`Server is listening on port ${config.PORT}...`));