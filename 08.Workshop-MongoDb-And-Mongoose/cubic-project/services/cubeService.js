import Cube from '../models/Cube.js';

function getAll(query) {
    let result = Cube.getAll();
    if (query.search) result = result.filter(x => x.name.toLowerCase().includes(query.search.toLowerCase()));
    if (query.from) result = result.filter(x => x.level >= query.from);
    if (query.to) result = result.filter(x => x.level <= query.to);
    return result;
};

function getOne(id) {
    return Cube.getOne(id);
}

function create(data) {
    const cube = new Cube(data);
    return cube.save();
}

export default {
    getAll,
    getOne,
    create
};