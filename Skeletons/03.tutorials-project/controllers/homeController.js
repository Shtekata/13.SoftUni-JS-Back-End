import Router from 'express';
import entityService from '../services/entityService.js';
import { TITLE_HOME } from '../config/constants.js';

const router = Router();

router.get('/', (req, res, next) => {
    if(req.params.search){}
    entityService.getAll(req.query.search, res.locals.user)
        .then(x => {
            const courses = [];
            x.forEach(y => {
                y.createdAt = y.createdAt.toString().slice(0, 10) + y.createdAt.toString().slice(15, 24)
                y.enrolled = y.usersEnrolled.length;
                courses.push(y)
            });
            res.render('home/home', { title: TITLE_HOME, courses, user: res.locals.user })
        })
        .catch(next);
});

export default router;