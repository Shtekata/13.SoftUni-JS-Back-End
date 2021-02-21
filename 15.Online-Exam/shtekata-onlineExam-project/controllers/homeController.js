// x = x.map(x => ({ ...x, createdAt: x.createdAt.toString().slice(0, 10) + x.createdAt.toString().slice(15, 24)}));
import Router from 'express';
import entityService from '../services/entityService.js';
import { TITLE_HOME } from '../config/constants.js';

const router = Router();

router.get('/', (req, res, next) => {
    if (res.locals.user) {
        const userId = res.locals.user._id;
        return entityService.getAllDesc(req.query.search, userId)
        .then(x => {
            // x.forEach(x => x.usersLiked = x.usersLiked.length);
            res.render('home/home', { title: TITLE_HOME, expenses: x, user: res.locals.user, err: req.session.err })
            req.session.err = null;
        })
        .catch(next);
    }
    entityService.getAllLikesDesc(req.query.search)
        .then(x => {
            x.forEach(y => y.usersLiked = y.usersLiked.length);
            x.sort((x, y) => y.usersLiked - x.usersLiked);
            x = x.slice(0, 3);
            res.render('home/home', { title: TITLE_HOME, plays: x, user: res.locals.user })
        })
        .catch(next);
});

export default router;