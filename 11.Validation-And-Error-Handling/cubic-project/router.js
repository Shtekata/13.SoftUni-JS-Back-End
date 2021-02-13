import Router from 'express';
import homeController from './controllers/homeController.js';
import cubeController from './controllers/cubeController.js';
import accessoryController from './controllers/accessoryController.js';
import authController from './controllers/authController.js';
import isAuthenticated from './middlewares/isAuthenticated.js';

const router = Router();
router.use('/', homeController);
router.use('/auth', authController);
router.use('/cubes', cubeController);
router.use('/accessories', isAuthenticated, accessoryController);
router.get('/500', (req, res) => res.render('500', { title: 'Server Error', error: req.session.error }));
router.get('*', (req, res) => res.render('404', { title: 'Page Not Found' }));

export default router;