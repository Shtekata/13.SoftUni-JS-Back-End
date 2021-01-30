import Router from 'express';
const router = Router();

router.get('/', (req, res) => res.render('products', { title: 'Cubicle' }));

router.get('/create', (req, res) => res.render('create', { title: 'Create Cube' }));
router.post('/create', (req, res) => res.redirect('/products'));

router.get('/details/:productId', (req, res) => res.render('details', { title: 'Cube Details' }));

export default router;