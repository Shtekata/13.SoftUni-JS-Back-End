import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../config/config.js';

const SALT_ROUNDS = config.SALT_ROUNDS;
const ENGLISH_ALPHANUMERIC_PATTERN = config.ENGLISH_ALPHANUMERIC_PATTERN;

const userSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: true,
        minlength: 5,
        validate: {
            validator: (x) => ENGLISH_ALPHANUMERIC_PATTERN.test(x),
            message: (x) => `${x.value} schould consist only english letters and digits!`
        }
    },
    password: {
        type: String, required: [true, 'Password is required!'],
        minlength: 8,
        validate: {
            validator: (x) => ENGLISH_ALPHANUMERIC_PATTERN.test(x),
            message: (x) => `Password schould consist only english letters and digits!`
        },
    },
    roles: [{ type: String }]
});

userSchema.pre('save', function (next) {
    bcrypt.genSalt(SALT_ROUNDS)
        .then(x => { return bcrypt.hash(this.password, x) })
        .then(x => {
            this.password = x;
            next();
        })
        .catch(x => console.log(x));
});

export default mongoose.model('User', userSchema);