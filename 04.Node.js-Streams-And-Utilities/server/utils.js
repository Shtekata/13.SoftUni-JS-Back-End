import fs from 'fs';

function readFileAsync(...params) {
    return new Promise((resolve, reject) => {
        fs.readFile(...params, (err, x) => {
            if (err) return reject(err);
            resolve(x);
       }) 
    });
}

export default {
    readFileAsync
}