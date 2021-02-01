import Router from 'express';
import { validateCubeFormInputs as validator } from './helpers/cubeHelperMiddleware.js';
import cubeService from '../services/cubeService.js';

const router = Router();

router.get('/', (req, res) => {
    cubeService.getAll(req.query)
        .then(x => res.render('home', { title: 'Cubicle', cubes: x }))
        .catch(() => res.status(500).end());
});

router.get('/create', (req, res) => res.render('create', { title: 'Create Cube' }));
router.post('/create', validator, (req, res) => {
    cubeService.create(req.body).then(x => res.redirect('/cubes')).catch(x => res.status(500).end());
});

router.get('/details/:productId', (req, res) => {
    cubeService.getOne(req.params.productId)
        .then(x => res.render('details', { title: 'Cube Details', cube: x }))
        .catch(() => res.status(500).end());
});

export default router;