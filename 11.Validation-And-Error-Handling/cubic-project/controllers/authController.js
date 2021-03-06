import { Router } from 'express';
import authService from '../services/authService.js';
import config from '../config/config.js';
import isGuest from '../middlewares/isGuest.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import passValidator from '../middlewares/passwords.js';
import { body, check, validationResult } from 'express-validator';

const router = Router();
const COOKIE_NAME = config.COOKIE_NAME;

router.get('/login', isGuest, (req, res) => {
    res.render('login', { title: 'Login Page' });
});
router.post('/login', isGuest, (req, res) => {
    const { username, password } = req.body;

    authService.login({ username, password })
        .then(x => { res.cookie(COOKIE_NAME, x); res.redirect('/cubes') })
        .catch(x => res.render('login', { title: 'Login Page', error: x }));
});

router.get('/register', isGuest, (req, res) => {
    res.render('register', { title: 'Register Page' });
});
router.post('/register',
    isGuest,
    // passValidator,
    // check('Username', 'Specify username').notEmpty(),
    // check('password', 'Password have to be between 5 and 10 characters!').isLength({ min: 5, max: 10 }),
    
    body('username', 'Specify username').notEmpty(),
    body('password', 'Password have to be between 5 and 10 characters!').isLength({ min: 5, max: 10 }).trim(),
    body('email', 'Your email is not valid').isEmail().normalizeEmail(),
    
    (req, res) => {
        const { username, password, repeatPassword, email } = req.body;

        // const errors = validationResult(req);
        // if (!errors.isEmpty()) return res.render('register', { title: 'Register Page', errors: errors.array() });
        
        if (password !== repeatPassword)
            // return res.render('register', { title: 'Register Page', error: 'Password missmatch!' });
            return res.render('register', { title: 'Register Page', error: { message: 'Password missmatch!'} });
       
        authService.register({ username, password })
            .then(x => {
                res.render('login', { title: 'Login Page', user: x?.username })
            })
            // .catch(x => res.render('register', { title: 'Register Page', errors: x }));
            .catch(x => res.render('register', { title: 'Register Page', error: x }));
    });

router.get('/logout', isAuthenticated, (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/cubes');
});

export default router;