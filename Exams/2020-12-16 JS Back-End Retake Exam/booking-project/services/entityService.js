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
                let err = {};
                if (!x.errors) err.msg = x.message;
                else {
                    Object.keys(x.errors).map(y =>
                        err.msg = err.msg ? `${err.msg}\n${x.errors[y].message}` : x.errors[y].message
                    );
                }
                reject(err);
            });
    });
}

function updateOne(entityId, entityData) {
    const data = {
        name: entityData.hotel,
        city: entityData.city,
        imageUrl: entityData.imgUrl,
        freeRooms: entityData['free-rooms']
    };
    return new Promise((resolve, reject) => {
        Entity.findByIdAndUpdate({ _id: entityId }, data, { useFindAndModify: false })
            .then(x => resolve(x))
            .catch(x => {
                let err = {};
                if (!x.errors) err.msg = x.message;
                else {
                    Object.keys(x.errors).map(y =>
                        err.msg = err.msg ? `${err.msg}\n${x.errors[y].message}` : x.errors[y].message
                    );
                }
                reject(err);
            });
    });
}

function deleteOne(id) {
    return new Promise((resolve, reject) => {
        Entity.findByIdAndDelete(id)
            .then(x => resolve(x))
            .catch(x => {
                let err = {};
                if (!x.errors) err.msg = x.message;
                else {
                    Object.keys(x.errors).map(y =>
                        err.msg = err.msg ? `${err.msg}\n${x.errors[y].message}` : x.errors[y].message
                    );
                }
                reject(err);
            });
    });
}

async function book(id, userId) {
    const user = await User.findById(userId);
    const entity = await Entity.findById(id);

    if (entity.freeRooms === 1) throw { msg: 'Not enough free rooms!' };
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