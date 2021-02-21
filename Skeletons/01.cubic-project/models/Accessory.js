import mongoose from 'mongoose';

const accessoryScheme = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required!'] },
    description: { type: String, required: [true, 'Description is required!'], maxlength: 50 },
    imageUrl: { type: String, required: [true, 'ImageURL is required!'], validate: /^https?/ },
    cubes: [{ type: mongoose.Types.ObjectId, ref: 'Cube' }]
});

export default mongoose.model('Accessory', accessoryScheme);