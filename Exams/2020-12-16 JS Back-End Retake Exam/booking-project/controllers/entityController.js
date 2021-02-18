import Router from 'express';
import entityService from '../services/entityService.js';
import accessoryService from '../services/entityService.js';
import isAuth from '../middlewares/isAuth.js';
import { body, validationResult } from 'express-validator';
import { ENGLISH_ALPHANUMERIC_PATTERN } from '../config/constants.js';

const router = Router();

router.get('/', (req, res, next) => {
    entityService.getAll(req.query)
        .then(x => { res.render('home', { title: 'BookingUni', hotels: x, infoMsg: 'Welcome!', isAuth: res.locals.isAuth }) })
        .catch(next);
});

router.get('/details/:id', (req, res, next) => {
    entityService.getOne(req.params.id)
        .then(x => {
            const userId = res.locals.user._id;
            let isNotOwner = true;
            let userBookedRoom = false;
            if (x.owner == userId) isNotOwner = false;
            if (x.usersBookedRoom.toString().includes(userId)) userBookedRoom = true;
            res.render('details', { title: 'Hotel Details', x, isNotOwner, userBookedRoom })
        })
        .catch(next)
});

router.get('/create', isAuth, (req, res) => res.render('create', { title: 'Create ' }));
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
            let err = {};
            const errors = validationResult(req).array();
            errors.forEach(x => err.message = err.message ? `${err.message}\n${x.msg}` : x.msg);
            return res.render('create', { title: 'Create Hotel', err, x: req.body });
        };

        entityService.createOne({
            owner: res.locals.user._id,
            name: req.body.hotel,
            city:req.body.city,
            imageUrl: req.body.imgUrl,
            freeRooms: req.body['free-rooms']
        })
            .then(x => res.redirect('/entities'))
            .catch(next);
    });

router.get('/edit/:id', isAuth, (req, res, next) => {
    entityService.getOne(req.params.cubeId)
        .then(x => {
            if (x.creator == req.user._id) res.render('editCube', { title: 'Edit Cube Page', x });
            else res.redirect('/cubes');
        })
        .catch(next);
})
router.post('/:cubeId/edit', isAuth, (req, res, next) => {
    entityService.getOne(req.params.cubeId)
        .then(x => {
            if (x.creator == req.user._id) return entityService.updateOne(req.params.cubeId, req.body);
            return;
        })
        .then(x => res.redirect(`/cubes/details/${req.params.cubeId}`))
        .catch(next);
})

router.get('/:cubeId/delete', isAuth, (req, res, next) => {
    entityService.getOne(req.params.cubeId)
        .then(x => {
            if (x.creator != req.user._id) res.redirect('/cubes'); 
            res.render('deleteCube', { title: 'Delete Cube Page', x });
        })
        .catch(next);
})
router.post('/:cubeId/delete', isAuth, (req, res, next) => {
    entityService.getOne(req.params.cubeId)
        .then(x => {
            if (x.creator != req.user._id) return;
            return entityService.deleteOne(req.params.cubeId)
        })
        .then(x => res.redirect('/cubes'))
        .catch(next);
})

router.get('/book/:id', isAuth, async (req, res, next) => {
    const id = req.params.id;
    const userId = res.locals.user._id;
    entityService.book(id, userId)
        .then(x => res.redirect(`/entities/details/${id}`))
        .catch(next);
});

export default router;