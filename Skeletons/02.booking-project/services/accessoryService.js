import Accessory from '../models/Accessory.js';

function getAll() {
    return Accessory.find().lean();
}

function getAllUnattached(cubeAccessories) {
    return Accessory.find({ _id: { $nin: cubeAccessories } }).lean();
}

function create(data) {
    const accessory = new Accessory(data);
    return new Promise((resolve, reject) => {
        accessory.save()
            .then(x => resolve(x))
            .catch(x => {
                let error = {};
                if (!x.errors) error.message = x.message;
                else {
                    Object.keys(x.errors).map(y => {
                        error.message = error.message ? `${error.message}\n${x.errors[y].message}` : x.errors[y].message;
                    });
                }
                reject(error);
            });
    });
}

export default {
    getAll,
    getAllUnattached,
    create
};