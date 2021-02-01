import Accessory from '../models/Accessory.js';
import Cube from '../models/Cube.js';

function getAll(query) {
    let result = Cube.find().lean();
    if (query.search) result = result.filter(x => x.name.toLowerCase().includes(query.search.toLowerCase()));
    if (query.from) result = result.filter(x => x.level >= query.from);
    if (query.to) result = result.filter(x => x.level <= query.to);
    return result;
};

function getOne(id) {
    return Cube.findById(id).lean();
}

function create(data) {
    const cube = new Cube(data);
    return cube.save();
}

async function attachAccessory(cubeId, accessoryId) {
    const cube = await Cube.findById(cubeId);
    const accessory = await Accessory.findById(accessoryId);

    cube.accessories.push(accessory);
    accessory.cubes.push(cube);
    const resultCube = cube.save();
    const resultAccessory = accessory.save();
    
    return Promise.all([resultCube, resultAccessory]);
}

export default {
    getAll,
    getOne,
    create,
    attachAccessory
};