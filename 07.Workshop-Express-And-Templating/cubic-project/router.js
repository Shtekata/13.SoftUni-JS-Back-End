import Router from 'express';
import productController from './controllers/productController.js';
import homeController from './controllers/homeController.js';

const router = Router();
router.use('/', homeController);
router.use('/products', productController);
router.get('*', (req, res) => res.render('404', { title: 'Page Not Found' }));

export default router;