import Router from 'express';
import { validateCubeFormInputs as validator } from './helpers/cubeHelperMiddleware.js';
import cubeService from '../services/cubeService.js';
import accessoryService from '../services/accessoryService.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = Router();

router.get('/', (req, res) => {
    cubeService.getAll(req.query)
        .then(x => res.render('home', { title: 'Cubicle', cubes: x }))
        .catch((x) => res.status(500).end());
});

router.get('/create', isAuthenticated, (req, res) => res.render('create', { title: 'Create Cube' }));
router.post('/create', isAuthenticated, validator, (req, res) => {
    cubeService.create(req.user._id, req.body)
        .then(x => res.redirect('/cubes'))
        .catch(x => res.status(500).end());
});

router.get('/details/:cubeId', (req, res) => {
    const cube = cubeService.getOneWithAccessories(req.params.cubeId)
        .then(x => res.render('details', { title: 'Cube Details', cube: x }))
        .catch(x => res.status(500).end());
});

router.get('/:cubeId/attach', isAuthenticated, async (req, res) => {
    const cube = await cubeService.getOne(req.params.cubeId);
    const accessories = accessoryService.getAllUnattached(cube.accessories);
    Promise.all([cube, accessories])
        .then(x => res.render('attachAccessory', { title: 'Attach Accessory', cube: x[0], accessories: x[1] }))
        .catch(x => res.status(500).end());
});
router.post('/:cubeId/attach', isAuthenticated, (req, res) => {
    cubeService.attachAccessory(req.params.cubeId, req.body.accessory)
        .then(x => res.redirect(`/cubes/details/${req.params.cubeId}`))
        .catch(x => res.status(500).end());
})

router.get('/:cubeId/edit', isAuthenticated, (req, res) => {
    cubeService.getOne(req.params.cubeId)
        .then(x => res.render('editCube', { title: 'Edit Cube Page', x }))
        .catch(x => res.status(500).end());
})
router.post('/:cubeId/edit', isAuthenticated, validator, (req, res) => {
    cubeService.updateOne(req.params.cubeId, req.body)
        .then(x => res.redirect(`/cubes/details/${req.params.cubeId}`))
        .catch(x => res.status(500).end());
})

export default router;