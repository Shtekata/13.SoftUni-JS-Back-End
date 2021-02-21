export const validateAccessoryFormInputs = (req, res, next) => {
    const data = {
        isValid: true,
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
    };
    if (req.body.name.trim().length < 3 || req.body.name.trim().length > 30) {
        data.isValid = false;
        data.nameMessage = 'Name have to be between 3 and 30 characters!';
    }
    if (req.body.description.trim().length < 5 || req.body.description.trim().length > 500) {
        data.isValid = false;
        data.descriptionMessage = 'Description have to be between 5 and 500 characters!';
    }
    if (!req.body.imageUrl.trim().startsWith('http')) {
        data.isValid = false;
        data.imageMessage = 'Url have to start with http or https!';
    }
    if (!data.isValid) return res.render('createAccessory', { data, title: 'Create Accessory' });
    next();
};
