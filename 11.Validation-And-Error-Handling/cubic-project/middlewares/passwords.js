import validator from 'validator';

const isStrongPasswordMiddleware = (req, res, next) => {
    const password = req.body.password;
    const isStrongPassword = validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    });
    if (!isStrongPassword)
        return res.render('register', {
            title: 'Register Page',
            error: 'You should have strong password!',
            username: req.body.username
        });
    next();
}

export default isStrongPasswordMiddleware;