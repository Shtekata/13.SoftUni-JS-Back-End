import Router from 'express';
import { validateCubeFormInputs as validator } from './helpers/cubeHelperMiddleware.js';
import cubeService from '../services/cubeService.js';
import accessoryService from '../services/accessoryService.js';

const router = Router();

router.get('/', (req, res) => {
    cubeService.getAll(req.query)
        .then(x => res.render('home', { title: 'Cubicle', cubes: x }))
        .catch(() => res.status(500).end());
});

router.get('/create', (req, res) => res.render('create', { title: 'Create Cube' }));
router.post('/create', validator, (req, res) => {
    cubeService.create(req.body)
        .then(x => res.redirect('/cubes'))
        .catch(x => res.status(500).end());
});

router.get('/details/:cubeId', (req, res) => {
    cubeService.getOne(req.params.cubeId)
        .then(x => res.render('details', { title: 'Cube Details', cube: x }))
        .catch(x => res.status(500).end());
});

router.get('/:cubeId/attach', (req, res) => {
    const cube = cubeService.getOne(req.params.cubeId);
    const accessoaries = accessoryService.getAll();
    Promise.all([cube, accessoaries])
        .then(x => res.render('attachAccessory', { title: 'Attach Accessory', cube: x[0], accessoaries: x[1] }))
        .catch(x => res.status(500).end());
});
router.post('/:cubeId/attach', (req, res) => {
    cubeService.attachAccessory(req.params.cubeId, req.body.accessory)
        .then(x => res.redirect(`/cubes/details/${req.params.cubeId}`))
        .catch(x => res.status(500).end());
})

export default router;