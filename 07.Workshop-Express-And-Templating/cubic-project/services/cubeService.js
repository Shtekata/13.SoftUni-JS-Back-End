import Cube from '../models/Cube.js';
import uniqid from 'uniqid';
import fs from 'fs';
import path from 'path';

function getAll() {
    return fs.readFile('./db/cubes.json', (err, x) => {
        if (err) console.log(err);
        return JSON.parse(x);
    });
};

function createCube(data) {
    console.log(path.resolve('db'));
    fs.readFile(path.join(path.resolve('db'), 'cubes.json'), (err, x) => {
        if (err) return console.log(err);
        const cube = new Cube(uniqid(), data.name, data.description, data.imageUrl, data.difficultyLevel);
        x = JSON.parse(x);
        x.push(cube);
        fs.writeFile(path.join(path.resolve('db'), 'cubes.json'), JSON.stringify(x), (err) => { if (err) return console.log(err) });
    });
}

export default {
    create: createCube
};