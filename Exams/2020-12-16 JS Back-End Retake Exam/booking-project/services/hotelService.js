import Accessory from '../models/Accessory.js';
import Hotel from '../models/Hotel.js';

async function getAll(query) {
    const result = Hotel.find().setOptions({ lean: true })
        .where({ name: { $regex: query.search || '', $options: 'i' } })
        .sort('freeRooms');
    return result;
};

function getOne(id) {
    return Hotel.findById(id).lean();
}

function getOneWithAccessories(id) {
    return Hotel.findById(id).populate('accessories').lean();
}

function createOne(data) {
    const cube = new Hotel({ ...data });
    return new Promise((resolve, reject) => {
        cube.save()
            .then(x => resolve(x))
            .catch(x => {
                let error = {};
                if (!x.errors) error.message = x.message;
                else {
                    Object.keys(x.errors).map(y =>
                        error.message = error.message ? `${error.message}\n${x.errors[y].message}` : x.errors[y].message
                    );
                }
                reject(error);
            });
    });
}

function updateOne(cubeId,cubeData) {
    return Hotel.findByIdAndUpdate({ _id: cubeId }, cubeData, { useFindAndModify: false });
}

function deleteOne(cubeId) {
    return Hotel.findByIdAndDelete(cubeId);
}

async function attachAccessory(cubeId, accessoryId) {
    const cube = await Hotel.findById(cubeId);
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
    getOneWithAccessories,
    createOne,
    updateOne,
    deleteOne,
    attachAccessory
};