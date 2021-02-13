import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../config/index.js';

const SALT_ROUNDS = config.SALT_ROUNDS;

const userSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: true,
        minlength: 5,
        validate: {
            validator: (x) => {
                const result = /^[a-zA-Z0-9]+$/.test(x);
                return result;
            },
            message: (x) => `${x.value} schould consist only english letters and digits!`
        }
    },
    password: { type: String, required: [true, 'Password is required!'] },
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