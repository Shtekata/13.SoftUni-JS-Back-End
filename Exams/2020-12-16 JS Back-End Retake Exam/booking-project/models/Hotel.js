import mongoose from 'mongoose';

const hotelScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true, maxlength: 50
    },
    imageUrl: {
        type: String,
        required: true,
        validate: /^https?/
    },
    freeRooms: {
        type: Number,
        required: true,
        min: 1, max: 100
    },
    owner: {
        type: mongoose.Types.ObjectId, required: true, ref: 'User'
    },
    usersBookedRoom: [{
        type: mongoose.Types.ObjectId, ref: 'User'
    }]
});

hotelScheme.methods.getInfo = function () { return `My name is ${this.name}` };
hotelScheme.virtual('presentation').get(function () { return `${this.name}: ${this.description}` });
// cubeScheme.path('imageUrl')
//     .validate(function () { return this.imageUrl.startsWith('http') }, 'ImageUrl should start with http or https!');

export default mongoose.model('Hotel', hotelScheme);