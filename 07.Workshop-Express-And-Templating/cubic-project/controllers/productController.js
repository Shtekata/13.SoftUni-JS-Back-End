import Router from 'express';
const router = Router();

router.get('/', (req, res) => res.render('home', { layout: false }));
router.get('/create', (req, res) => res.render('create', { layout: false }));

export default router;