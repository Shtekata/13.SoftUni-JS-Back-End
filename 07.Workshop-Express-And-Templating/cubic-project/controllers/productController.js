import Router from 'express';
import validator from '../middlewares/createCubeValidationMiddleware.js';
import cubeService from '../services/cubeService.js';

const router = Router();

router.get('/', (req, res) => {
    const cubes = cubeService.getAll()
    res.render('products', { title: 'Cubicle', cubes });
});

router.get('/create', (req, res) => res.render('create', { title: 'Create Cube' }));
router.post('/create', validator, (req, res) => {
    cubeService.create(req.body);
    res.redirect('/products');
});

router.get('/details/:productId', (req, res) => res.render('details', { title: 'Cube Details' }));

export default router;