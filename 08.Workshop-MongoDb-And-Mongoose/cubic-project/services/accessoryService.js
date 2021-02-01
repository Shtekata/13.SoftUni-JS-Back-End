import Accessory from '../models/Accessory.js';

function getAll() {
    return Accessory.find().lean();
}

function create(data) {
    const accessory = new Accessory(data);
    return accessory.save();
}

export default {
    getAll,
    create
};