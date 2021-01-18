import url from 'url';
import fs from 'fs';

export default (req, res) => {
    const pathname = url.parse(req.url).pathname;
    if (pathname === '/' && req.method === 'GET') {
        fs.readFile('./views/home/index.html', (e, x) => {
            if (e) {
                res.writeHead(404, { 'Content-Type': 'text/plain;charset=utf-8' });
                res.write(`Error: ${e.message}`);
                return res.end();
            };
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.write(x);
            res.end();
        })
    } else {
        return true;
    }
};