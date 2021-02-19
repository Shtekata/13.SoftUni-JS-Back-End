import mongoose from 'mongoose';

const hotelScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 4
    },
    description: {
        type: String,
        required: true,
        minlength: 20
    },
    imageUrl: {
        type: String,
        required: true,
        validate: /^https?/
    },
    duration: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true
    },
    usersEnrolled: [{
        type: mongoose.Types.ObjectId, ref: 'User'
    }]
});

export default mongoose.model('Course', hotelScheme);