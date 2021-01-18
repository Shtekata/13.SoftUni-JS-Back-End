import http from 'http';
import url from 'url';
import querystring from 'querystring';
import fs from 'fs';
import pubSub from './pubSub.js';
import * as init from './init.js';
import * as logger from './logger.js';
import eventEmitter from './events.js';
// import * as demo from './demo.js';
// import * as demo2 from './demo2.js';
import utils from './utils.js';
import util from 'util';

const port = 5000;
let data = null;
const contentTypeHtml = 'text/html;charset=utf-8';
const statusCodeOk = '200';
const statusCodeError = '404';

function requestHandler(req, res) {
    // console.log(req.method);
    // console.log(req.headers);

    const reqUrl = url.parse(req.url);
    const params = querystring.parse(reqUrl.query);
    // console.log(reqUrl.pathname);
    // console.log(params);

    // req.on('data', x => console.log(JSON.parse(x)));
    req.on('data', x => console.log(x));
    req.on('end', () => console.log('Request body is received!'));

    const response = (data, statusCode, contentType, res) => {
        res.writeHead(statusCode, { 'Content-Type': contentType })
        if (data && data !== 'html') {
            const view = addDataToTemplate(data, params);
            res.write(view);
        }
        if (!data || data !== 'html') res.end();
    }

    const addDataToTemplate = (data, params) => {
        const template1 = data.replace('{{name}}', params.name || 'Guest');
        const template2 = template1.replace('{{age}}', params.age || '0');
        const replacer = new RegExp(params.tempOld, 'g');
        const template3 = template2.replace(replacer, params.tempNew || '');
        return template3;
    }

    // const readStream = fs.createReadStream('./views/cats.html');
    const readStream = fs.createReadStream('./views/cats.html', { highWaterMark: 10000 });

    switch (reqUrl.pathname) {
        case '/':
            data = 'Hello World!';
            response(data, statusCodeOk, contentTypeHtml, res);
            break;
        case '/cats':
            data = 'html';
            // readStream.on('data', x => setTimeout(() => { res.write(x); console.log(x); }, 2000));
            // readStream.on('end', () => setTimeout(() => res.end(), 3500));

            // // readStream.on('data', x => res.write(x));
            // // readStream.on('end', () => res.end());
            // readStream.pipe(res);
            // response(data, statusCodeOk, contentTypeHtml, res);

            // // fs.readFile('./views/cats.html', 'utf8', (err, data) => {
            // fs.readFile('./views/cats.html', (err, data) => {
            //     if (err) { res.end(); return console.log(`Error: ${err.message}!`) };
            //     response(data, statusCodeOk, contentTypeHtml, res);
            //     // console.log(data);
            // });

            // utils.readFileAsync('./views/cats.html').then(x => response(x, statusCodeOk, contentTypeHtml, res));

            const readFileAsync = util.promisify(fs.readFile);
            readFileAsync('./views/cats.html', 'utf8').then(x => response(x, statusCodeOk, contentTypeHtml, res));

            // onCatsRequest(params.name);
            pubSub.publish('cats', params);
            eventEmitter.emit('cats', params);
            break;
        case '/dogs':
            data = 'Hello Dogs!';
            response(data, statusCodeOk, contentTypeHtml, res);
            pubSub.publish('dogs', params);
            eventEmitter.emit('dogs', params);
            break;
        case '/moons':
            data = 'html';
            const htmlFile = util.promisify(fs.readFile);
            htmlFile('./views/moons.html', 'utf8').then(x => response(x, statusCodeOk, contentTypeHtml, res));
            break;
        default:
            data = null;
            response(data, statusCodeError, contentTypeHtml, res);
            break;
    }
}

const app = http.createServer(requestHandler);
app.listen(port, () => console.log(`Server is listening on port: ${port}... http://localhost:5000`));