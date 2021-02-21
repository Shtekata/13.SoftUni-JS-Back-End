import mongoose from 'mongoose';
import {
    ENGLISH_ALPHANUMERIC_PATTERN,
    ENGLISH_ALPHANUMERIC_PATTERN_FOR_EMAIL,
    ENGLISH_ALPHANUMERIC_PATTERN_WITH_SPACE
} from '../config/constants.js';

const userSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    username: {
        type: String,
        required: [true, 'Username is required!'],
        minlength: 4,
        unique: true,
        // minlength: 3,
        // validate: {
        //     validator: (x) => ENGLISH_ALPHANUMERIC_PATTERN.test(x),
        //     message: (x) => `${x.value} schould consist only english letters and digits!`
        // },
    },
    fullName: {
        type: String,
        // required: [true, 'Full name is required!'],
        // unique: true,
        // minlength: 3,
        // validate: {
        //     validator: (x) => ENGLISH_ALPHANUMERIC_PATTERN_WITH_SPACE.test(x),
        //     message: (x) => `${x.value} schould consist only english letters and digits!`
        // },
    },
    email: {
        type: String,
        // required: [true, 'Email is required!'],
        // unique: true,
        // minlength: 3,
        //  validate: {
        //     validator: (x) => ENGLISH_ALPHANUMERIC_PATTERN_FOR_EMAIL.test(x),
        //     message: (x) => `${x.value} schould consist only english letters and digits!`
        // },
    },
    password: {
        type: String,
        minlength: 4,
        required: [true, 'Password is required!'],
    },
    amount: {
        type: Number,
        required: [true, 'Amound is required!'],
        default: 0
    },
    roles: [{ type: String }],
    expenses: [{
        type: mongoose.Types.ObjectId, ref: 'Expense'
    }],
});

export default mongoose.model('User', userSchema);