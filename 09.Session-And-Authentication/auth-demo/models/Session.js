import mongoose from 'mongoose';

const sessionScheme = new mongoose.Schema({
    _id: { type: String, required: true, uniq: true },
    username: { type: String,  minlength:3, maxlength: 50 },
    coko: { type: String, minlength:3, maxlength: 50 },
    car: { type: String, minlength: 3, maxlength: 50 },
    password: { type: String }
});

sessionScheme.methods.getInfo = function () { return `My name is ${this.username}` };
sessionScheme.virtual('presentation').get(function () { return `${this.username}: ${this.coko}: ${this.car}` });

export default mongoose.model('Session', sessionScheme);