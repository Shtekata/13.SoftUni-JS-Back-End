import mongoose from 'mongoose';

const shoesScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Shoe name is required!'],
        unique:true,
        // minlength: 5
    },
    description: {
        type: String,
        // required: true,
        // minlength: 20
    },
    price: {
        type: Number,
        required: [true, 'Price is required!'],
        min: 0  
    },
    imageUrl: {
        type: String,
        required: true,
        validate: /^https?/
    },
    brand: {
        type: String,
         required: [true, 'Brand is required!'],
    },
    createdAt: {
        type: Date,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId, required: true, ref: 'User'
    },
    buyers: [{
        type: mongoose.Types.ObjectId, ref: 'User'
    }]
});

shoesScheme.pre('validate', function (next) {
    const date = new Date();
    this.createdAt = date;
    next();
});

export default mongoose.model('Shoe', shoesScheme);