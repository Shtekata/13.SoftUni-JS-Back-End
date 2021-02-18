import { Router } from 'express';
import authService from '../services/authService.js';
import config from '../config/config.js';
import isGuest from '../middlewares/isGuest.js';
import isAuth from '../middlewares/isAuth.js';
import { body, validationResult } from 'express-validator';
import { ENGLISH_ALPHANUMERIC_PATTERN } from '../config/constants.js';

const router = Router();
const COOKIE_NAME = config.COOKIE_NAME;

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login', { title: 'Login Page', isLoading: false });
});
router.post('/login', isGuest, (req, res) => {
    const { username, password } = req.body;
    authService.login({ username, password })
        .then(x => { res.cookie(COOKIE_NAME, x, { httpOnly: true }); res.redirect('/hotels') })
        .catch(x => res.render('auth/login', { title: 'Login Page', err: x }));
});

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register', { title: 'Register Page' });
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
            let err = {};
            const errors = validationResult(req).array();
            errors.forEach(x => err.message = err.message ? `${err.message}\n${x.msg}` : x.msg);
            return res.render('auth/register', { title: 'Register Page', err, username, email })
        };
        
        authService.register({ username, password, email })
            .then(x => authService.login({ username: x.username, password }))
            .then(x => { res.cookie(COOKIE_NAME, x); res.redirect('/hotels') })
            .catch(x => res.render('auth/register', { title: 'Register Page', err: x }))
    });

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/hotels');
});

export default router;