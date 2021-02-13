import User from '../models/User.js';
import bcrypt from 'bcrypt';
import config from '../config/index.js';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = config.SALT_ROUNDS;
const SECRET = config.SECRET;

const register = ({ username, password }) => {
    return User.findOne({ username: { $regex: new RegExp(username, 'i') } })
        .then(x => {
            // if (x && username) throw { message: 'User with given username already exists!' };
            // return bcrypt.genSalt(SALT_ROUNDS);
            return true;
        })
        // .then(x => { return bcrypt.hash(password, x) })
        .then(x => {
            // const user = new User({ username, password: x, roles: ['user'] });
            const user = new User({ username, password, roles: ['user'] });
            return user.save();
        })
        .catch(x => {
            // let result = {};
            // Object.keys(x.errors).map(y =>
            //     result.message = result.message ? `${result.message}\n${x.errors[y].message}` : x.errors[y].message
            // );
            const result = Object.keys(x.errors).map(y => ({ msg: x.errors[y].message }));
            throw result;
        })
};

const login = ({ username, password }) => {
    return User.findOne({ username }).then(x => {
        if (!x) throw { message: 'User with given username do not exists!' };
        return bcrypt.compare(password, x.password).then(y => {
            if (!y) throw { message: 'Password does not match!' };
            return jwt.sign({ _id: x._id, username: x.username, roles: x.roles }, SECRET);
        })
    })
}

export default {
    register,
    login
}