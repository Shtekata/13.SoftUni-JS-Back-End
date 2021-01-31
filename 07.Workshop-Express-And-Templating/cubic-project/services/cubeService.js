import Cube from '../models/Cube.js';
import uniqid from 'uniqid';
import fs from 'fs';
import path from 'path';

let cubesDb = undefined;
fs.readFile(path.join(path.resolve('db'), 'cubes.json'), (err, x) => {
    if (err) return console.log(err);
    cubesDb = JSON.parse(x);
});
    
function getAll() {
    return cubesDb;
};

function getOne(id) {
    return cubesDb.find(x => x.id === id);
}

function createCube(data) {
    const cube = new Cube(uniqid(), data.name, data.description, data.imageUrl, data.difficultyLevel);
    cubesDb.push(cube);
    fs.writeFile(path.join(path.resolve('db'), 'cubes.json'),
        JSON.stringify(cubesDb),
        (err) => { if (err) return console.log(err) });
};

export default {
    getAll,
    getOne,
    create: createCube
};