import fs from 'fs';

// const readStream = fs.createReadStream('./views/cats.html', 'utf8');
// const readStream = fs.createReadStream('./views/cats.html', { highWaterMark: 1000, encoding: 'utf8' });
const readStream = fs.createReadStream('./views/cats.html');
readStream.on('data', (x) => {
    // if (x instanceof Error) { console.log(`Error: ${x}`); return; }
    console.log(x);
    writeStream.write(x);
});
readStream.on('end', () => { console.log('Reading ended!'); writeStream.end(); });
readStream.on('error', (x) => console.log(`Error: ${x}`));

// const writeStream = fs.createWriteStream('./write.txt', { encoding: 'utf8' });
const writeStream = fs.createWriteStream('./write.txt');
writeStream.on('finish', () => console.log('Writting ended!'));
writeStream.write('Hello world!');
writeStream.write('\nAnd Pesho!');
writeStream.write('\nAnd Gosho!');
for (let i = 0; i <= 10; i++) writeStream.write(`\n${i}`);
writeStream.write('\n');
writeStream.write('\n');
// writeStream.end();