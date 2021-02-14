import mongoose from 'mongoose';
import { ENGLISH_ALPHANUMERIC_PATTERN } from '../config/constants.js';

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
    email: {
        type: String,
        required: true,
        unique: true
    },
    roles: [{ type: String }]
});

export default mongoose.model('User', userSchema);