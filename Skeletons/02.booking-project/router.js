import Router from 'express';
import homeController from './controllers/homeController.js';
import entityController from './controllers/entityController.js';
import authController from './controllers/authController.js';
import isAuth from './middlewares/isAuth.js';

const router = Router();
router.use('/', homeController);
router.use('/auth', authController);
router.use('/entities', entityController);
router.get('/500', (req, res) => res.render('500', { title: 'Server Error', err: req.session.err }));
router.get('*', (req, res) => res.status(404).render('404', { title: 'Page Not Found', err: req.session.err }));

export default router;