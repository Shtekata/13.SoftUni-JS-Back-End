import User from '../models/User.js';
import bcrypt from 'bcrypt';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = config.SALT_ROUNDS;
const SECRET = config.SECRET;

const register = ({ username, password }) => {
    return User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } })
        .then(x => {
            if (x && username) throw { message: 'User with given username already exists!' };
            return bcrypt.genSalt(SALT_ROUNDS);
        })
        .then(x => { return bcrypt.hash(password, x) })
        .then(x => {
            const user = new User({ username, password: x, roles: ['user'] });
            return user.save();
        })
        .catch(x => {
            let error = {};
            if (!x.errors) {
                error.message = x.message;
            } else {
                const errors = Object.keys(x.errors).map(y => ({ 'err-msg': x.errors[y].message }));
                Object.keys(x.errors).map(y =>
                    error.message = error.message ? `${error.message}\n${x.errors[y].message}` : x.errors[y].message
                );
            }
            throw error;
        });
};

const login = ({ username, password }) => User.findOne({ username })
    .then(async x => {
        if (!x) throw { message: 'User with given username do not exists!' };
        const y = await bcrypt.compare(password, x.password);
        return { x, y };
    }).then(z => {
        if (!z.y) throw { message: 'Password does not match!' };
        return jwt.sign({ _id: z.x._id, username: z.x.username, roles: z.x.roles }, SECRET);
    });


export default {
    register,
    login
}