import User from '../models/User.js';
import Entity from '../models/Entity.js';

function getAll(query) {
    return Entity.find().setOptions({ lean: true })
        .where({ name: { $regex: query.search || '', $options: 'i' } })
        .sort('-freeRooms');
};

function getOne(id) {
    return Entity.findById(id).lean();
}

function getOneWithAccessories(id) {
    return Entity.findById(id).populate('accessories').lean();
}

function createOne(data) {
    const cube = new Entity({ ...data });
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

function updateOne(entityId,entityData) {
    return Entity.findByIdAndUpdate({ _id: entityId }, entityData, { useFindAndModify: false });
}

function deleteOne(cubeId) {
    return Entity.findByIdAndDelete(cubeId);
}

async function book(id, userId) {
    const user = await User.findById(userId);
    const entity = await Entity.findById(id);

    if (entity.freeRooms === 0) throw { msg: 'Not enough free rooms!' };
    entity.freeRooms--;

    user.bookedHotels.push(entity);
    entity.usersBookedRoom.push(user);
    const resultUser = user.save();
    const resultEntity = entity.save();
    
    return Promise.all([resultUser, resultEntity]);
}

export default {
    getAll,
    getOne,
    getOneWithAccessories,
    createOne,
    updateOne,
    deleteOne,
    book
};