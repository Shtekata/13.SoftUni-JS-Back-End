import Router from 'express';
import homeController from './controllers/homeController.js';
import hotelController from './controllers/hotelController.js';
import authController from './controllers/authController.js';
import isAuth from './middlewares/isAuth.js';

const router = Router();
router.use('/', homeController);
router.use('/auth', authController);
router.use('/hotels', hotelController);
router.get('/500', (req, res) => res.render('500', { title: 'Server Error', error: req.session.error }));
router.get('*', (req, res) => res.status(404).render('404', { title: 'Page Not Found' }));

export default router;