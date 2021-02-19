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
        minlength: 5,
        required: [true, 'Password is required!'],
    },
    email: {
        type: String,
        unique: true
    },
    roles: [{ type: String }],
    enrolledCourses: [{
        type: mongoose.Types.ObjectId, ref: 'Course'
    }],
});

export default mongoose.model('User', userSchema);