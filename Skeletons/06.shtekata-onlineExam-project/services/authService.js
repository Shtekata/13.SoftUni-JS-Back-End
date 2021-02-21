import User from '../models/User.js';
import bcrypt from 'bcrypt';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = config.SALT_ROUNDS;
const SECRET = config.SECRET;

const login = ({ username, fullName, password, email }) => User.findOne({ username })
    .then(async x => {
        if (!x) throw { msg: 'User with given username do not exists!' };
        const y = await bcrypt.compare(password, x.password);
        return { x, y };
    }).then(z => {
        if (!z.y) throw { msg: 'Password does not match!' };
        return jwt.sign({ _id: z.x._id, username: z.x.username, email: z.x.email, roles: z.x.roles }, SECRET);
    });

const register = ({ username, fullName, password, email, amount }) => {
    return User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } })
        .then(x => {
            if (x && username) throw { message: 'User with given username already exists!' };
            return bcrypt.genSalt(SALT_ROUNDS);
        })
        .then(x => { return bcrypt.hash(password, x) })
        .then(x => {
            const user = new User({ username, fullName, password: x, email, roles: ['user'], amount });
            return user.save();
        })
        .catch(x => {
            let err = {};
            if (!x.errors) {
                err.msg = x.message;
            } else {
                const errors = Object.keys(x.errors).map(y => ({ 'err-msg': x.errors[y].message }));
                Object.keys(x.errors).map(y =>
                    err.msg = err.msg ? `${err.msg}\n${x.errors[y].message}` : x.errors[y].message
                );
            }
            throw err;
        });
};

const getUser = (id) => User.findById(id);

const getUserWithExpenses = (id) => User.findById(id).populate('expenses').lean();

async function updateOne(userId, data) {
    const user = await User.findById(userId);
    data.amount = user.amount + +data.amount;
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate({ _id: userId }, data, { useFindAndModify: false })
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

export default {
    login,
    register,
    getUser,
    getUserWithExpenses,
    updateOne
}