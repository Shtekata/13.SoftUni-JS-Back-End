import { Router } from 'express';
import authService from '../services/authService.js';
import config from '../config/index.js';

const router = Router();
const COOKIE_NAME = config.COOKIE_NAME;

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login Page' });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    authService.login({ username, password })
        .then(x => { res.cookie(COOKIE_NAME, x); res.redirect('/cubes') })
        .catch(x => res.render('login', { title: 'Login Page', error: x.message }));
})

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register Page' });
});

router.post('/register', (req, res) => {
    const { username, password, repeatPassword } = req.body;
    if (password !== repeatPassword)
        return res.render('register', { title: 'Register Page', error: 'Password missmatch!' });
       
    authService.register({ username, password })
        .then(x => res.render('login', { title: 'Login Page', user: x.username }))
        .catch(x => res.render('register', { title: 'Register Page', error: x.message }));
})

export default router;