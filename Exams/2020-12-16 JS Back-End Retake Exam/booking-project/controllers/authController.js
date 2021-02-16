import { Router } from 'express';
import authService from '../services/authService.js';
import config from '../config/config.js';
import isGuest from '../middlewares/isGuest.js';
import isAuth from '../middlewares/isAuth.js';
import { body, validationResult } from 'express-validator';

const router = Router();
const COOKIE_NAME = config.COOKIE_NAME;
const ENGLISH_ALPHANUMERIC_PATTERN = config.ENGLISH_ALPHANUMERIC_PATTERN;

router.get('/login', isGuest, (req, res) => {
    res.render('login', { title: 'Login Page' });
});
router.post('/login', isGuest, (req, res) => {
    const { username, password } = req.body;
    authService.login({ username, password })
        .then(x => { res.cookie(COOKIE_NAME, x); res.redirect('/hotels') })
        .catch(x => res.render('login', { title: 'Login Page', error: x }));
});

router.get('/register', isGuest, (req, res) => {
    res.render('register', { title: 'Register Page' });
});
router.post('/register',
    isGuest,
    body('username', 'Specify username!').trim().notEmpty(),
    body('password').trim()
        .isLength({ min: 6 }).withMessage('Password have to be at least 6 chars long!')
        .matches(ENGLISH_ALPHANUMERIC_PATTERN).withMessage('Password schould consist only english letters and digits!'),
    body('rePassword').custom((value, { req }) => {
        if (value === req.body.password) return true;
        throw 'Password confurmation does not match password!';
    }),
    body('email', 'Your email is not valid')
        // .optional({ checkFalsy: true })
        .isEmail(),
    (req, res, next) => {
        const { username, password, email } = req.body;

        if (!validationResult(req).isEmpty()) {
            let error = {};
            const errors = validationResult(req).array();
            errors.forEach(x => error.message = error.message ? `${error.message}\n${x.msg}` : x.msg);
            return res.render('register', { title: 'Register Page', error })
        };
        
        authService.register({ username, password, email })
            .then(x => {
                authService.login({ username: x.username, password })
                    .then(x => { res.cookie(COOKIE_NAME, x); res.redirect('/hotels') })
                    .catch(next);
            })
            .catch(x => res.render('register', { title: 'Register Page', error: x }));
    });

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/hotels');
});

export default router;