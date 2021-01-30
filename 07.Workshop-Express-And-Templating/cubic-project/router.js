import Router from 'express';
import productController from './controllers/productController.js';
import aboutController from './controllers/aboutController.js';

const router = Router();
router.use('/', productController);
router.use('/about', aboutController);
router.get('*', (req, res) => res.render('404', { layout: false }));

export default router;