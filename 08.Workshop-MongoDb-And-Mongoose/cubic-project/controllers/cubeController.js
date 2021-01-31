import Router from 'express';
import { validateCubeFormInputs as validator } from './helpers/cubeHelperMiddleware.js';
import cubeService from '../services/cubeService.js';

const router = Router();

router.get('/', (req, res) => {
    const cubes = cubeService.getAll(req.query);
    res.render('home', { title: 'Cubicle', cubes });
});

router.get('/create', (req, res) => res.render('create', { title: 'Create Cube' }));
router.post('/create', validator, (req, res) => {
    cubeService.create(req.body).then(x => res.redirect('/cubes')).catch(x => res.status(500).end());
});

router.get('/details/:productId', (req, res) => {
    const cube = cubeService.getOne(req.params.productId);
    res.render('details', { title: 'Cube Details', cube });
    console.log(cube);
});

export default router;