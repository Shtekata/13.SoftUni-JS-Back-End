export default (err, req, res, next) => {
    req.session.error = err;
    if (!err.statusCode) err.statusCode = 500;
    res.redirect('/500');
}
