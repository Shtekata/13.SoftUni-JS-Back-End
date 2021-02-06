import Session from '../models/Session.js';

const sessionMiddleware = function (options) {
    return (req, res, next) => {
        if (!req.cookies.id) {
            const session = new Session();
            session.save().then(x => {
                req.session = { id: x._id };
                res.cookie('id', x._id, options);
                next();
            });
        } else {
            const cookieId = req.cookies.id;
            Session.findById(cookieId).then(x => {
                !x ?
                    (() => {
                        const session = new Session();
                        session.save().then(x => {
                            req.session = { id: x._id };
                            res.cookie('id', x._id);
                            next();
                        });
                    })()
                :
                    (() => {
                        req.session = x;
                        next();
                    })()
            }).catch(x => {
                const session = new Session();
                session.save().then(x => {
                    req.session = { id: x._id };
                    res.cookie('id', x._id);
                    next();
                });
            });
        }
    };
};

export default sessionMiddleware;