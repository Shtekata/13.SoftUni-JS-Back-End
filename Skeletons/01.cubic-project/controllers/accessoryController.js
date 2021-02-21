import Router from 'express';
import { validateAccessoryFormInputs as validator } from '../middlewares/validatorAccessory.js';
import accessoryService from '../services/accessoryService.js';

const router = Router();

router.get('/create', (req, res) => res.render('createAccessory', { title: 'Create Accessory' }));
router.post('/create', validator, (req, res, next) => {
    accessoryService.create(req.body)
        .then(x => res.redirect('/cubes'))
        .catch(next);
});

export default router;