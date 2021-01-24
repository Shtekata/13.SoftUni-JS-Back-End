function middleware(req, res, next) {
    console.log('hello from matId middleware');
    console.log(req.params);

    if (req.params.matId) return next();

    res.status(403).send('You need to specify matId');
}

export default middleware;