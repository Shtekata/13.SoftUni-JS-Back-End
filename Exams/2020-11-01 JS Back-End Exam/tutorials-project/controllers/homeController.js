import Router from 'express';
import entityService from '../services/entityService.js';
import { TITLE_HOME } from '../config/constants.js';

const router = Router();

router.get('/', (req, res, next) => {
    entityService.getAll(req.query)
        .then(x => { res.render('home/home', { title: TITLE_HOME, entities: x, user: res.locals.user }) })
        .catch(next);
});

export default router;