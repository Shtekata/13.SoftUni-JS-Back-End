import http from 'http';
import url from 'url';
import querystring from 'querystring';
import fs from 'fs';

const port = 5000;
let data = null;
const contentTypeHtml = 'text/html;charset=utf-8';
const statusCodeOk = '200';
const statusCodeError = '404';

function requestHandler(req, res) {
    // console.log(req.url);
    console.log(req.method);
    // console.log(req.httpVersion);
    console.log(req.headers);

    const reqUrl = url.parse(req.url);
    // console.log(reqUrl);
    console.log(reqUrl.pathname);
    const params = querystring.parse(reqUrl.query);
    console.log(params);

    function response(data, statusCode, contentType, res) {
        res.writeHead(statusCode, { 'Content-Type': contentType })
        if(data) res.write(data);
        res.end();
    }

    // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    switch (reqUrl.pathname) {
        case '/':
            data = 'Hello World!';
            response(data, statusCodeOk, contentTypeHtml, res);
            break;
        case '/cats':
            fs.readFile('./views/cats.html', (err, data) => {
                if (err) { return console.log(`Error: ${err.message}!`) };
                console.log(data);
                response(data, statusCodeOk, contentTypeHtml, res);
            })
            // res.write('<h1>Hello Cats!</h1>');
            break;
        case '/dogs':
            data = 'Hello Dogs!';
            response(data, statusCodeOk, contentTypeHtml, res);
            break;
        default:
            data = null;
            response(data, statusCodeError, contentTypeHtml, res);
            break;
    }
    // res.write('Hello World!');
    // res.end();
}

const app = http.createServer(requestHandler);
app.listen(port, () => console.log(`Server is listening on port: ${port}... http://localhost:5000`));