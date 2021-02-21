import Router from 'express';
import entityService from '../services/entityService.js';
import isAuth from '../middlewares/isAuth.js';
import { body, validationResult } from 'express-validator';
import {
    ENGLISH_ALPHANUMERIC_PATTERN_WITH_SPACE,
    ENTITY_NAME,
    ENTITY_PROPERTY_ONE,
    ENTITY_PROPERTY_ONE_MIN_LENGTH,
    ENTITY_PROPERTY_TWO,
    ENTITY_PROPERTY_TWO_MIN_LENGTH,
    ENTITY_PROPERTY_THREE,
    ENGLISH_ALPHANUMERIC_MESSAGE,
    ENTITIES
} from '../config/constants.js';

const router = Router();

router.get('/details/:id', (req, res, next) => {
    entityService.getOne(req.params.id)
        .then(x => {
            const userId = res.locals.user._id;
            let isNotOwner = true;
            let userEnrolledCourse = false;
            if (x.creator == userId) isNotOwner = false;
            if (x.usersEnrolled.toString().includes(userId)) userEnrolledCourse = true;
            res.render(`entity/details`, { title: `${ENTITY_NAME} Details`, x, isNotOwner, userEnrolledCourse, err: req.session.err })
        })
        .catch(next)
});

router.get('/create', isAuth, (req, res) => res.render('entity/create', { title: `Create ${ENTITY_NAME}` }));
router.post('/create',
    isAuth,
    body('title').trim()
        .notEmpty().withMessage(`Specify ${ENTITY_PROPERTY_ONE}!`)
        .isLength({ min: ENTITY_PROPERTY_ONE_MIN_LENGTH })
        .withMessage(`${ENTITY_PROPERTY_ONE} must be at least ${ENTITY_PROPERTY_ONE_MIN_LENGTH} characters!`)
        .matches(ENGLISH_ALPHANUMERIC_PATTERN_WITH_SPACE)
        .withMessage(ENGLISH_ALPHANUMERIC_MESSAGE),
    body('description').trim()
        .notEmpty().withMessage(`Specify ${ENTITY_PROPERTY_TWO}!`)
        .isLength({ min: ENTITY_PROPERTY_TWO_MIN_LENGTH })
        .withMessage(`${ENTITY_PROPERTY_TWO} must be at least ${ENTITY_PROPERTY_TWO_MIN_LENGTH} characters!`),
    body('imageUrl', 'Not valid image URL').isURL({protocols: ['http','https']}),
    body('duration', `Specify ${ENTITY_PROPERTY_THREE}`).notEmpty(),
    (req, res, next) => {

        if (!validationResult(req).isEmpty()) {
            let err = {};
            const errors = validationResult(req).array();
            errors.forEach(x => err.msg = err.msg ? `${err.msg}\n${x.msg}` : x.msg);
            return res.render('entity/create', { title: `Create ${ENTITY_NAME}`, err, x: req.body });
        };

        let data = req.body;
        data.creator = res.locals.user._id;
        entityService.createOne(data)
            .then(x => res.redirect('/'))
            .catch(next);
    });

router.get('/edit/:id', isAuth, (req, res, next) => {
    entityService.getOne(req.params.id)
        .then(x => {
            if (x.creator == res.locals.user._id) res.render('entity/edit', { title: `Edit ${ENTITY_NAME} Page`, x });
            else res.redirect('/');
        })
        .catch(next);
})
router.post('/edit/:id', isAuth, (req, res, next) => {
    entityService.getOne(req.params.id)
        .then(x => {
            if (x.creator != res.locals.user._id) return;
            return entityService.updateOne(req.params.id, req.body);
        })
        .then(x => res.redirect(`/${ENTITIES}/details/${req.params.id}`))
        .catch(next);
})

router.get('/delete/:id', isAuth, (req, res, next) => {
    entityService.getOne(req.params.id)
        .then(x => {
            if (x.creator != res.locals.user._id) return;
            return entityService.deleteOne(req.params.id)
        })
        .then(x => res.redirect('/'))
        .catch(next);
})

router.get('/enroll/:id', isAuth, async (req, res, next) => {
    const id = req.params.id;
    const userId = res.locals.user._id;
    entityService.enroll(id, userId)
        .then(x => res.redirect(`/${ENTITIES}/details/${id}`))
        .catch(x => { req.session.err = x; res.redirect(`/${ENTITIES}/details/${id}`)})
});

export default router;