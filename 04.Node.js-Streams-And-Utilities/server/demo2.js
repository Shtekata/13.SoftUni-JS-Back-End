import fs from 'fs';

const readStream = fs.createReadStream('./views/cats.html');
// readStream.on('data', (x) => {
//     console.log(x);
//     writeStream.write(x);
// });
// readStream.on('end', () => { console.log('Reading ended!'); writeStream.end(); });
readStream.on('end', () => console.log('Reading ended!'));
readStream.on('error', (x) => console.log(`Error: ${x}`));

const writeStream = fs.createWriteStream('./write2.txt');
writeStream.on('finish', () => console.log('Writting ended!'));
// readStream.pipe(writeStream);
writeStream.write('Hello world!');
writeStream.write('\nAnd Pesho!');
writeStream.write('\nAnd Gosho!');
for (let i = 0; i <= 10; i++) writeStream.write(`\n${i}`);
writeStream.write('\n');
writeStream.write('\n');

import zlib from 'zlib';
const gzip = zlib.createGzip();
readStream.pipe(gzip).pipe(writeStream);
