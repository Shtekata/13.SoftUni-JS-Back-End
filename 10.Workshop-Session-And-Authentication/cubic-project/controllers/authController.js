import { Router } from 'express';
import authService from '../services/authService.js';

const router = Router();

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login Page' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register Page' });
});

router.post('/register', (req, res) => {
    authService.register(req.body)
        .then(x => {
            
            res.redirect('/auth/login');
        })
        .catch(x => res.render('register', { title: 'Register Page', error: x.message }));
})

export default router;