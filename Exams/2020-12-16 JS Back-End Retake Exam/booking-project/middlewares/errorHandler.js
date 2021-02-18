export default (err, req, res, next) => {
    const error = {};
    error.message = err.message || 'Something went wrong';
    error.status = err.status || 500;
    req.session.err = error;
    res.redirect('/500');
}
