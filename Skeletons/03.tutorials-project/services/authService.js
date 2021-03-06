import User from '../models/User.js';
import bcrypt from 'bcrypt';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = config.SALT_ROUNDS;
const SECRET = config.SECRET;

const login = ({ username, password }) => User.findOne({ username })
    .then(async x => {
        if (!x) throw { msg: 'User with given username do not exists!' };
        const y = await bcrypt.compare(password, x.password);
        return { x, y };
    }).then(z => {
        if (!z.y) throw { msg: 'Password does not match!' };
        return jwt.sign({ _id: z.x._id, username: z.x.username, roles: z.x.roles }, SECRET);
    });

const register = ({ username, password, email }) => {
    return User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } })
        .then(x => {
            if (x && username) throw { message: 'User with given username already exists!' };
            return bcrypt.genSalt(SALT_ROUNDS);
        })
        .then(x => { return bcrypt.hash(password, x) })
        .then(x => {
            const user = new User({ username, password: x, email, roles: ['user'] });
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

const getUserWithBookedAndOwnHotels = (id) => User.findById(id).populate('bookedHotels').populate('offeredHotels');

export default {
    login,
    register,
    getUser,
    getUserWithBookedAndOwnHotels
}