import { Router } from 'express';
import authService from '../services/authService.js';
import config from '../config/config.js';
import isGuest from '../middlewares/isGuest.js';
import isAuth from '../middlewares/isAuth.js';
import { body, validationResult } from 'express-validator';
import {
    ENGLISH_ALPHANUMERIC_PATTERN,
    ENGLISH_ALPHANUMERIC_MESSAGE,
    USERNAME_MIN_LENGTH,
    PASSWORD_MIN_LENGTH,
    PASSWORD_CONFIRMATION_ERR
} from '../config/constants.js';

const router = Router();
const COOKIE_NAME = config.COOKIE_NAME;

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login', { title: 'Login Page', isLoading: false });
});
router.post('/login', isGuest, (req, res) => {
    const { username, password } = req.body;
    authService.login({ username, password })
        .then(x => { res.cookie(COOKIE_NAME, x, { httpOnly: true }); res.redirect('/') })
        .catch(x => res.render('auth/login', { title: 'Login Page', err: x, username }));
});

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register', { title: 'Register Page' });
});
router.post('/register',
    isGuest,
    body('username').trim()
        .notEmpty().withMessage('Specify username!')
        .isLength({ min: USERNAME_MIN_LENGTH }).withMessage(`Username must be at least ${USERNAME_MIN_LENGTH} characters!`)
        .matches(ENGLISH_ALPHANUMERIC_PATTERN).withMessage(ENGLISH_ALPHANUMERIC_MESSAGE),
    body('password').trim()
        .notEmpty().withMessage('Specify password!')
        .isLength({ min: PASSWORD_MIN_LENGTH }).withMessage(`Password must be at least ${PASSWORD_MIN_LENGTH} characters!`)
        .matches(ENGLISH_ALPHANUMERIC_PATTERN).withMessage(ENGLISH_ALPHANUMERIC_MESSAGE),
    body('rePassword').custom((value, { req }) => {
        if (value === req.body.password) return true;
        throw PASSWORD_CONFIRMATION_ERR;
    }),
    body('email', 'Your email is not valid')
        .optional({ checkFalsy: true })
        .matches(ENGLISH_ALPHANUMERIC_PATTERN).withMessage('Password schould consist only english letters and digits!')
        .isEmail(),
    (req, res, next) => {
        const { username, password, email } = req.body;

        if (!validationResult(req).isEmpty()) {
            let err = {};
            const errors = validationResult(req).array();
            errors.forEach(x => err.msg = err.msg ? `${err.msg}\n${x.msg}` : x.msg);
            return res.render('auth/register', { title: 'Register Page', err, username })
        };
        
        authService.register({ username, password, email })
            .then(x => authService.login({ username: x.username, password }))
            .then(x => { res.cookie(COOKIE_NAME, x); res.redirect('/') })
            .catch(x => res.render('auth/register', { title: 'Register Page', err: x }))
    });

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/');
});

router.get('/profile/:id', (req, res, next) => {
    const user = authService.getUserWithBookedAndOwnHotels(req.params.id)
        .then(x => {
            x.userBookedHotels = x.bookedHotels.map(x => x.name);
            x.userOfferedHotels = x.offeredHotels.map(x => x.name);
            res.render('auth/profile', x)
        })
        .catch(next);
});

export default router;