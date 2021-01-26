import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    age: Number
}, { toJSON: { virtuals: true } });
personSchema.methods.getInfo = function () {
    console.log(`Hello my name is ${this.name} and I'm ${this.age} years old!`);
}
personSchema.virtual('birthYear').get(function () {
    const currentYear = new Date().getFullYear();
    return `${currentYear - this.age}`;
})

const Person = mongoose.model('Person', personSchema);

export default Person;