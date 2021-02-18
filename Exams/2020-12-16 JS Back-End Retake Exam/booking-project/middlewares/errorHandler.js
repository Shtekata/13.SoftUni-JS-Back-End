export default (err, req, res, next) => {
    err.message = err.message || 'Something went wrong';
    err.status = err.status || 500;
    req.session.error = err;
    res.redirect('/500');
}
