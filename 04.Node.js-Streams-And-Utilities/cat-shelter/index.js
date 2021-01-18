import http from 'http';
import handlers from './handlers/index.js';

const port = 5000;

http.createServer((req, res) => {
    
for (const handler of handlers) {
    if (!handler(req, res)) { break;}
}

}).listen(port);