import fs from 'fs';

fs.readdir('.', (err, x) => {
    if (err) return console.log(err);
    // console.log(x);
    fs.writeFile('./files/file-list.txt', `${x.join('\n')}`, err => { if (err) return console.error(err.message) });
})

fs.mkdir('./files', err => { if (err) return console.error(err.message) });