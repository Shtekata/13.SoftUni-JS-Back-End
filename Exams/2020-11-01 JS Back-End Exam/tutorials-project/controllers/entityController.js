import Router from 'express';
import entityService from '../services/entityService.js';
import isAuth from '../middlewares/isAuth.js';
import { body, validationResult } from 'express-validator';
import {
    ENGLISH_ALPHANUMERIC_PATTERN,
    ENTITY_NAME,
    ENTITY_NAME_MIN_LENGTH,
    ENTITY_PROPERTY_ONE,
    ENTITY_PROPERTY_ONE_MIN_LENGTH,
    ENGLISH_ALPHANUMERIC_MESSAGE
} from '../config/constants.js';

const router = Router();

router.get('/details/:id', (req, res, next) => {
    entityService.getOne(req.params.id)
        .then(x => {
            const userId = res.locals.user._id;
            let isNotOwner = true;
            let userBookedRoom = false;
            if (x.owner == userId) isNotOwner = false;
            if (x.usersBookedRoom.toString().includes(userId)) userBookedRoom = true;
            res.render('details', { title: 'Hotel Details', x, isNotOwner, userBookedRoom, err: req.session.err })
        })
        .catch(next)
});

router.get('/create', isAuth, (req, res) => res.render('create', { title: 'Create ' }));
router.post('/create',
    isAuth,
    body('title').trim()
        .notEmpty().withMessage(`Specify ${ENTITY_NAME}!`)
        .isLength({ min: ENTITY_NAME_MIN_LENGTH })
        .withMessage(`${ENTITY_NAME} must be at least ${ENTITY_NAME_MIN_LENGTH} characters!`)
        .matches(ENGLISH_ALPHANUMERIC_PATTERN)
        .withMessage(ENGLISH_ALPHANUMERIC_MESSAGE),
    body('description').trim()
        .notEmpty().withMessage(`Specify ${ENTITY_PROPERTY_ONE}!`)
        .isLength({ min: ENTITY_PROPERTY_ONE_MIN_LENGTH })
        .withMessage(`${ENTITY_PROPERTY_ONE} must be at least ${ENTITY_PROPERTY_ONE_MIN_LENGTH} characters!`)
        .matches(ENGLISH_ALPHANUMERIC_PATTERN)
        .withMessage(ENGLISH_ALPHANUMERIC_MESSAGE),
    body('imgUrl', 'Not valid image URL').isURL(),
    body('free-rooms', 'Rooms have to be between 1 and 100!').isInt({ min: 1, max: 100 }),
    (req, res, next) => {

        if (!validationResult(req).isEmpty()) {
            let err = {};
            const errors = validationResult(req).array();
            errors.forEach(x => err.msg = err.msg ? `${err.msg}\n${x.msg}` : x.msg);
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
    entityService.getOne(req.params.id)
        .then(x => {
            if (x.owner == res.locals.user._id) res.render('edit', { title: 'Edit Hotel Page', x });
            else res.redirect('/entities');
        })
        .catch(next);
})
router.post('/edit/:id', isAuth, (req, res, next) => {
    entityService.getOne(req.params.id)
        .then(x => {
            if (x.owner != res.locals.user._id) return;
            return entityService.updateOne(req.params.id, req.body);
        })
        .then(x => res.redirect(`/entities/details/${req.params.id}`))
        .catch(next);
})

router.get('/delete/:id', isAuth, (req, res, next) => {
    entityService.getOne(req.params.id)
        .then(x => {
            if (x.owner != res.locals.user._id) return;
            return entityService.deleteOne(req.params.id)
        })
        .then(x => res.redirect('/entities'))
        .catch(next);
})

router.get('/book/:id', isAuth, async (req, res, next) => {
    const id = req.params.id;
    const userId = res.locals.user._id;
    entityService.book(id, userId)
        .then(x => res.redirect(`/entities/details/${id}`))
        .catch(x => { req.session.err = x; res.redirect(`/entities/details/${id}`)})
});

export default router;