import Router from 'express';
const router = Router();

router.get('/', (req, res) => res.render('home', { title: 'Cubicle' }));
router.get('/create', (req, res) => res.render('create', { title: 'Create Cube Page' }));

export default router;