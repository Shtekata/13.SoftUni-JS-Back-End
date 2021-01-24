import mongoose from 'mongoose';
import consts from './consts.js';

const details = consts;

// const uri = 'mongodb://localhost:27017/mongoTest';
const uri = `mongodb+srv://${details}@shtekatacluster.0dh5a.mongodb.net/mongoTest?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connecton error:'));
db.once('open', () => console.log('Connected to database!'));

const personSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const Person = mongoose.model('Person', personSchema);

// const person = new Person({ name: 'Pesho', age: 30 });
// const person = new Person({ name: 'Gosho', age: 20 });
// const person = new Person({ name: 'Stamat', age: 25 });
// person.save((err, x) => {
//     if (err) return console.log(err);
//     console.log(x);
// });

// const person = new Person({ name: 'Petkan', age: 26 });
// person.save()
//     .then(x => console.log(x));

const person = new Person({ name: 'Maria', age: 28 });
async function save() {
    const x = await person.save();
    console.log(x);
}
save();