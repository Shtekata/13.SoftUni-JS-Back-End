import express from 'express';
import config from './config/config.js';
import expressConfig from './config/express.js';
import mongooseConfig from './config/mongoose.js';
import Session from './models/Session.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import consts from './config/consts.js';

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
        });
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
            .then(x => { req.session.coko = coko; res.redirect('/') })
            .catch(x => console.log(x.message));;
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
            .then(x => { req.session.car = car; res.redirect('/') })
            .catch(x => console.log(x.message));;
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

app.get('/login/:username/:password', (req, res) => {
    bcrypt.compare(req.params.password, req.session.password, (e, x) => {
        if (e) console.log(e.message);
        const result = req.session.username === req.params.username && x;
        res.send(result ? 'You are logged!' : 'Credentials do not match!');
    });
});

app.get('/token/create', (req, res) => {
    res.send(`
    <form action='/token/create' method='post'>
    <div>
    <label>Username:</label>
    <input type='text' name='username'/>
    </div>
    <div>
    <label>Password:</label>
    <input type='password' name='password'/>
    </div>
    <div>
    <input type='submit' value='Log In'/>
    </div>
    </form>
    `);
});

app.post('/token/create', async (req, res) => {
    const password = await new Promise((resolve, reject) => {
        bcrypt.hash(req.body.password, 9, (e, x) => {
            resolve(x);
        });
    });
    const payloads = {
        _id: req.sessionID,
        username: req.body.username,
        password
    };
    const options = { expiresIn: '2d' };
    const secret = consts.secretKey;

    const token = jwt.sign(payloads, secret, options);

    if (!req.session.user) {
        const _id = req.sessionID;
        const session = new Session({ _id });
        await session.save().catch(x => console.log(x.message));
        req.session.user = true;
    };
    Session.findByIdAndUpdate(req.sessionID, { token }, { useFindAndModify: false })
        .then(x => {
            req.session.token = token;
            // res.json({ token });
            // res.setHeader('jwt', token);
            res.cookie('jwt', token);
            res.redirect('/token/show')
        }).catch(x => console.log(x.message));
});

app.get('/token/show', (req, res) => {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, consts.secretKey);
    res.send(decodedToken);
});

app.get('/token/login', (req, res) => {
    res.send(`
    <form action='/token/login' method='post'>
    <div>
    <label>Username:</label>
    <input type='text' name='username'/>
    </div>
    <div>
    <label>Password:</label>
    <input type='password' name='password'/>
    </div>
    <div>
    <input type='submit' value='Log In'/>
    </div>
    </form>
    `);
});

app.post('/token/login', (req, res) => {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, consts.secretKey);
    
    let result;
    bcrypt.compare(req.body.password, decodedToken.password, (e, x) => {
        x && req.body.username === decodedToken.username ? result = true : result = false;
        result
            ? res.send(`You are logged in! Welcome ${decodedToken.username}`)
            : res.status(400).send('Invalid credentials!');
    });
});

app.listen(config.PORT, x => console.log(`Server is listening on port ${config.PORT}...`));