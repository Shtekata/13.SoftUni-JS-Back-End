import fs from 'fs/promises';
import path from 'path';

let cubesDb = undefined;
fs.readFile(path.join(path.resolve('db'), 'cubes.json')).then(x => cubesDb = JSON.parse(x)).catch(x => console.log(x));

export default {
    getAll() {
        return cubesDb;  
    },
    getOne(id) {
        return cubesDb.find(x => x.id === id);
    },
    create(cube) {
        cubesDb.push(cube);
        return fs.writeFile(path.join(path.resolve('db'), 'cubes.json'), JSON.stringify(cubesDb));
    }
}