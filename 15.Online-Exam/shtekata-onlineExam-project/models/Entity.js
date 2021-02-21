import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    merchant: {
        type: String,
        required: [true, 'Merchant is required!'],
        minlength: 4
        // unique:true,
    },
     total: {
        type: Number,
        required: [true, 'Total is required!'],
        min: 0  
    },
     category: {
        type: String,
         required: [true, 'Category is required!'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minlength: 3,
        maxlength: 30,
    },
    // imageUrl: {
    //     type: String,
    //     required: true,
    //     validate: /^https?/
    // },
    report: {
        type: Boolean,
        default: false
    },
    // isPublic: {
    //     type: Boolean,
    //     default: false
    // },
    // price: {
    //     type: Number,
    //     required: [true, 'Price is required!'],
    //     min: 0  
    // },
    // brand: {
    //     type: String,
    //      required: [true, 'Brand is required!'],
    // },
    createdAt: {
        type: Date,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId, required: true, ref: 'User'
    },
    // usersLiked: [{
    //     type: mongoose.Types.ObjectId, ref: 'User'
    // }]
});

expenseSchema.pre('validate', function (next) {
    const date = new Date();
    this.createdAt = date;
    next();
});

export default mongoose.model('Expense', expenseSchema);