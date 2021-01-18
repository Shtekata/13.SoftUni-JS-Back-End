import url from 'url';
import fs from 'fs';

function getContentType(url) {
    if (url.endsWith('css')) return 'text/css';
    if (url.endsWith('html')) return 'text/html';
    if (url.endsWith('jpg')) return 'image/jpeg';
    if (url.endsWith('jpeg')) return 'text/jpeg';
    if (url.endsWith('js')) return 'text/javascript';
    if (url.endsWith('json')) return 'applicaton/json';
    if (url.endsWith('ico')) return 'image/vnd.microsoft.icon';
}

export default (req, res) => {
    const pathname = url.parse(req.url).pathname;
    if (pathname.startsWith('/content') && req.method === 'GET') {
        fs.readFile(`.${pathname}`, (e, x) => {
            if (e) {
                res.writeHead(404, { 'Content-Type': 'text/plain;charset=utf-8' });
                res.write(`Error: ${e.message}`);
                return res.end();
            };
            const contentType = getContentType(req.url);
            res.writeHead(200, { 'Content-Type': `${contentType}` });
            res.write(x);
            res.end();
        })
    } else {
        return true;
    }
};