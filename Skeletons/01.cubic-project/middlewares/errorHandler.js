export default (err, req, res, next) => {
    req.session.error = err;
    if (!res.statusCode) res.statusCode = 500;
    res.redirect('/500');
}
