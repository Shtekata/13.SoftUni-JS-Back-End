import mongoose from 'mongoose';

const courseScheme = new mongoose.Schema({
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
    },
    creator: {
        type: mongoose.Types.ObjectId, required: true, ref: 'User'
    },
    usersEnrolled: [{
        type: mongoose.Types.ObjectId, ref: 'User'
    }]
});

courseScheme.pre('save', function (next) {
    const date = new Date();
    this.createdAt = date;
    next();
});

export default mongoose.model('Course', courseScheme);