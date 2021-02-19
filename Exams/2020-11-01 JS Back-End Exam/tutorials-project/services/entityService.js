import User from '../models/User.js';
import Entity from '../models/Entity.js';
import authService from './authService.js';

function getAll(query, user) {
    if (user) {
        return Entity.find().setOptions({ lean: true })
            .where({ title: { $regex: query || '', $options: 'i' } })
            .sort('createdAt');
    }
    return Entity.find().setOptions({ lean: true })
        .where({ title: { $regex: query || '', $options: 'i' } })
        .sort('-usersEnrolled')
        .limit(3);
};

function getOne(id) {
    return Entity.findById(id).lean();
}

function getOneWithAccessories(id) {
    return Entity.findById(id).populate('accessories').lean();
}

function createOne(data) {
    const entity = new Entity({ ...data });
    return new Promise((resolve, reject) => {
        entity.save()
            .then(x => resolve(x))
            .catch(x => {
                let err = {};
                if (!x.errors) err.msg = x.message;
                else {
                    Object.keys(x.errors).map(y =>
                        err.msg = err.msg ? `${err.msg}\n${x.errors[y].message}` : x.errors[y].message
                    );
                }
                reject(err)
            });
    });
}

function updateOne(entityId, data) {
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

async function enroll(id, userId) {
    const user = await User.findById(userId);
    const entity = await Entity.findById(id);

    user.enrolledCourses.push(entity);
    entity.usersEnrolled.push(user);
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
    enroll
};