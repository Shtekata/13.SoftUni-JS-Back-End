import mongoose from 'mongoose';
import config from '../config/config.js';

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
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
    },
    roles: [{ type: String }]
});

export default mongoose.model('User', userSchema);