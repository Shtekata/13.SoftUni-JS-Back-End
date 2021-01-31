import Router from 'express';
import cubeController from './controllers/cubeController.js';
import homeController from './controllers/homeController.js';

const router = Router();
router.use('/', homeController);
router.use('/products', cubeController);
router.get('*', (req, res) => res.render('404', { title: 'Page Not Found' }));

export default router;