import Accessory from '../models/Accessory.js';

function create(data) {
    const accessory = new Accessory(data);
    return accessory.save();
}

export default {
    create
};