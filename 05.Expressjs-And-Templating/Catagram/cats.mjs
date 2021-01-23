import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const catsData = require('./cats.json');
// import catsData from './cats.json';
import fs from 'fs';

// const cats = [];
const cats = catsData.slice();

function add(name) {
    cats.push(name);
    fs.writeFile('./cats.json', JSON.stringify(cats), (err) => {
        if (err) return console.log(`some error: ${err}`);
        console.log('successful write');
    });
}

function getAll() {
    return cats.slice();
}

export default {
    add,
    getAll
}