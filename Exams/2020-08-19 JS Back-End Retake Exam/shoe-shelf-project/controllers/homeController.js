import Router from 'express';
import entityService from '../services/entityService.js';
import { TITLE_HOME } from '../config/constants.js';

const router = Router();

router.get('/', (req, res, next) => {
    if(req.params.search){}
    entityService.getAll(req.query.search, res.locals.user)
        .then(x => {
            // x = x.map(x => ({ ...x, createdAt: x.createdAt.toString().slice(0, 10) + x.createdAt.toString().slice(15, 24)}));
            x.forEach(y => {
                y.createdAt = y.createdAt.toString().slice(0, 10) + y.createdAt.toString().slice(15, 24)
                y.buyers = y.buyers.length;
            })
            x.sort((x, y) => y.buyers - x.buyers);
            res.render('home/home', { title: TITLE_HOME, shoes: x, user: res.locals.user })
        })
        .catch(next);
});

export default router;