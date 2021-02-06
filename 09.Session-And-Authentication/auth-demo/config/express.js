import express from 'express';
import cookieParser from 'cookie-parser';
import sessionMiddleware from '../middlewares/session.js';
import expressSession from 'express-session';

function setupExpress(app) {

    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    // app.use(sessionMiddleware());
    app.use(expressSession({
        secret: 'mecret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }));
}

export default setupExpress;