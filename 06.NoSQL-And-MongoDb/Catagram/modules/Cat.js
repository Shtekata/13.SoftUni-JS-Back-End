import mongoose from 'mongoose';

const catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    breed: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }
});

export default mongoose.model('cat', catSchema);