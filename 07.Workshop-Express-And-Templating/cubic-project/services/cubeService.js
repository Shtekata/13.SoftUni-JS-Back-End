import Cube from '../models/Cube.js';
import uniqid from 'uniqid';
import fs from 'fs';
import path from 'path';
import fsProm from 'fs/promises';

let cubesDb = undefined;
// fs.readFile(path.join(path.resolve('db'), 'cubes.json'), (err, x) => {
//     if (err) return console.log(err);
//     cubesDb = JSON.parse(x);
// });
fsProm.readFile(path.join(path.resolve('db'), 'cubes.json')).then(x => cubesDb = JSON.parse(x)).catch(x => console.log(x));
    
function getAll(query) {
    let result = cubesDb;
    if (query.search) result = result.filter(x => x.name.toLowerCase().includes(query.search.toLowerCase()));
    if (query.from) result = result.filter(x => x.level >= query.from);
    if (query.to) result = result.filter(x => x.level <= query.to);
    return result;
};

function getOne(id) {
    return cubesDb.find(x => x.id === id);
}

// function createCube(data) {
function createCube(data, callback) {
    const cube = new Cube(uniqid(), data.name, data.description, data.imageUrl, data.difficultyLevel);
    cubesDb.push(cube);
    fs.writeFile(path.join(path.resolve('db'), 'cubes.json'),
        JSON.stringify(cubesDb),
        // (err) => { if (err) return console.log(err) });
        callback);
};
    
function createCubeProm(data) {
    const cube = new Cube(uniqid(), data.name, data.description, data.imageUrl, data.difficultyLevel);
    cubesDb.push(cube);
    return fsProm.writeFile(path.join(path.resolve('db'), 'cubes.json'), JSON.stringify(cubesDb));
};

export default {
    getAll,
    getOne,
    create: createCube,
    createProm: createCubeProm
};