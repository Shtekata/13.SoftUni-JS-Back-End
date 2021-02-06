import express from 'express';
import cookieParser from 'cookie-parser';
import sessionMiddleware from '../middlewares/session.js';


function setupExpress(app) {

    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(sessionMiddleware());
}

export default setupExpress;