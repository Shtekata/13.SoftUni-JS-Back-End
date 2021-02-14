import Router from 'express';
import { validateCubeFormInputs as validator } from '../middlewares/validatorCube.js';
import cubeService from '../services/cubeService.js';
import accessoryService from '../services/accessoryService.js';
import isAuth from '../middlewares/isAuth.js';

const router = Router();

router.get('/', (req, res, next) => {
    cubeService.getAll(req.query)
        .then(x => res.render('home', { title: 'Cubicle', cubes: x, error: res.locals.error }))
        .catch(next);
});

router.get('/details/:cubeId', (req, res, next) => {
    cubeService.getOneWithAccessories(req.params.cubeId)
        .then(x => {
            let isOwner = false;
            if (x.creator == req.user?._id) isOwner = true;
            res.render('details', { title: 'Cube Details', cube: x, isOwner })
        })
        .catch(next)
});

router.get('/create', isAuth, (req, res) => res.render('create', { title: 'Create Cube' }));
router.post('/create', isAuth, validator, (req, res, next) => {
    cubeService.createOne(req.user._id, req.body)
        .then(x => res.redirect('/cubes'))
        .catch(next);
});

router.get('/:cubeId/edit', isAuth, (req, res, next) => {
    cubeService.getOne(req.params.cubeId)
        .then(x => {
            if (x.creator == req.user._id) res.render('editCube', { title: 'Edit Cube Page', x });
            else res.redirect('/cubes');
        })
        .catch(next);
})
router.post('/:cubeId/edit', isAuth, validator, (req, res, next) => {
    cubeService.getOne(req.params.cubeId)
        .then(x => {
            if (x.creator == req.user._id) return cubeService.updateOne(req.params.cubeId, req.body);
            return;
        })
        .then(x => res.redirect(`/cubes/details/${req.params.cubeId}`))
        .catch(next);
})

router.get('/:cubeId/delete', isAuth, (req, res, next) => {
    cubeService.getOne(req.params.cubeId)
        .then(x => {
            if (x.creator != req.user._id) res.redirect('/cubes'); 
            res.render('deleteCube', { title: 'Delete Cube Page', x });
        })
        .catch(next);
})
router.post('/:cubeId/delete', isAuth, (req, res, next) => {
    cubeService.getOne(req.params.cubeId)
        .then(x => {
            if (x.creator != req.user._id) return;
            return cubeService.deleteOne(req.params.cubeId)
        })
        .then(x => res.redirect('/cubes'))
        .catch(next);
})

router.get('/:cubeId/attach', isAuth, async (req, res, next) => {
    const cube = await cubeService.getOne(req.params.cubeId);
    const accessories = accessoryService.getAllUnattached(cube.accessories);
    Promise.all([cube, accessories])
        .then(x => res.render('attachAccessory', { title: 'Attach Accessory', cube: x[0], accessories: x[1] }))
        .catch(next);
});
router.post('/:cubeId/attach', isAuth, (req, res, next) => {
    cubeService.attachAccessory(req.params.cubeId, req.body.accessory)
        .then(x => res.redirect(`/cubes/details/${req.params.cubeId}`))
        .catch(next);
})

export default router;