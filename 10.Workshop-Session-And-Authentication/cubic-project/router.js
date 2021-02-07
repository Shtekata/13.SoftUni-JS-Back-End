import Router from 'express';
import homeController from './controllers/homeController.js';
import cubeController from './controllers/cubeController.js';
import accessoryController from './controllers/accessoryController.js';
import authController from './controllers/authController.js';

const router = Router();
router.use('/', homeController);
router.use('/auth', authController);
router.use('/cubes', cubeController);
router.use('/accessories', accessoryController);
router.get('*', (req, res) => res.render('404', { title: 'Page Not Found' }));

export default router;