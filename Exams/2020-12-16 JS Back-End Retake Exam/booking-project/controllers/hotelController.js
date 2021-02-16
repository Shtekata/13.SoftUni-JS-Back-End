import Router from 'express';
import { validateCubeFormInputs as validator } from '../middlewares/validatorCube.js';
import hotelService from '../services/hotelService.js';
import accessoryService from '../services/accessoryService.js';
import isAuth from '../middlewares/isAuth.js';
import { body, validationResult } from 'express-validator';
import { ENGLISH_ALPHANUMERIC_PATTERN } from '../config/constants.js';

const router = Router();

router.get('/', (req, res, next) => {
    hotelService.getAll(req.query)
        .then(x => res.render('home', { title: 'BookingUni', hotels: x, error: res.locals.error }))
        .catch(next);
});

router.get('/details/:cubeId', (req, res, next) => {
    hotelService.getOneWithAccessories(req.params.cubeId)
        .then(x => {
            let isOwner = false;
            if (x.creator == req.user?._id) isOwner = true;
            res.render('details', { title: 'Cube Details', cube: x, isOwner })
        })
        .catch(next)
});

router.get('/create', isAuth, (req, res) => res.render('create', { title: 'Create Cube' }));
router.post('/create',
    isAuth,
    body('hotel').trim()
        .notEmpty().withMessage('Specify hotel!')
        .isLength({ min: 4 }).withMessage('Hotel name must be at least 4 chars long'),
    body('city').trim()
        .notEmpty().withMessage('Specify city!')
        .matches(ENGLISH_ALPHANUMERIC_PATTERN).withMessage('City schould consist only english letters and digits!'),
    body('imgUrl', 'Not valid image URL').isURL(),
    body('free-rooms', 'Rooms have to be between 1 and 100!').isInt({ min: 1, max: 100 }),
    (req, res, next) => {

        if (!validationResult(req).isEmpty()) {
            let error = {};
            const errors = validationResult(req).array();
            errors.forEach(x => error.message = error.message ? `${error.message}\n${x.msg}` : x.msg);
            return res.render('register', { title: 'Register Page', error });
        };

        hotelService.createOne({
            owner: req.user._id,
            name: req.body.hotel,
            city:req.body.city,
            imageUrl: req.body.imgUrl,
            freeRooms: req.body['free-rooms']
        })
            .then(x => res.redirect('/hotels'))
            .catch(next);
    });

router.get('/:cubeId/edit', isAuth, (req, res, next) => {
    hotelService.getOne(req.params.cubeId)
        .then(x => {
            if (x.creator == req.user._id) res.render('editCube', { title: 'Edit Cube Page', x });
            else res.redirect('/cubes');
        })
        .catch(next);
})
router.post('/:cubeId/edit', isAuth, validator, (req, res, next) => {
    hotelService.getOne(req.params.cubeId)
        .then(x => {
            if (x.creator == req.user._id) return hotelService.updateOne(req.params.cubeId, req.body);
            return;
        })
        .then(x => res.redirect(`/cubes/details/${req.params.cubeId}`))
        .catch(next);
})

router.get('/:cubeId/delete', isAuth, (req, res, next) => {
    hotelService.getOne(req.params.cubeId)
        .then(x => {
            if (x.creator != req.user._id) res.redirect('/cubes'); 
            res.render('deleteCube', { title: 'Delete Cube Page', x });
        })
        .catch(next);
})
router.post('/:cubeId/delete', isAuth, (req, res, next) => {
    hotelService.getOne(req.params.cubeId)
        .then(x => {
            if (x.creator != req.user._id) return;
            return hotelService.deleteOne(req.params.cubeId)
        })
        .then(x => res.redirect('/cubes'))
        .catch(next);
})

router.get('/:cubeId/attach', isAuth, async (req, res, next) => {
    const cube = await hotelService.getOne(req.params.cubeId);
    const accessories = accessoryService.getAllUnattached(cube.accessories);
    Promise.all([cube, accessories])
        .then(x => res.render('attachAccessory', { title: 'Attach Accessory', cube: x[0], accessories: x[1] }))
        .catch(next);
});
router.post('/:cubeId/attach', isAuth, (req, res, next) => {
    hotelService.attachAccessory(req.params.cubeId, req.body.accessory)
        .then(x => res.redirect(`/cubes/details/${req.params.cubeId}`))
        .catch(next);
})

export default router;