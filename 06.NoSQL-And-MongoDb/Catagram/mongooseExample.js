import mongoose from 'mongoose';
import consts from './consts.js';
import Person from './modules/Person.js';

const details = consts;

// const uri = 'mongodb://localhost:27017/mongoTest';
const uri = `mongodb+srv://${details}@shtekatacluster.0dh5a.mongodb.net/mongoTest?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connecton error:'));
db.once('open', () => console.log('Connected to database!'));

const person = new Person({ name: 'Pes', age: 30 });
const person2 = new Person({ name: 'Gosho', age: 20 });
const person3 = new Person({ name: 'Stamat', age: 25 });
const person4 = new Person({ name: 'Petkan', age: 26 });
const person5 = new Person({ name: 'Maria', age: 28 });

person4.save((err, x) => {
    if (err) return console.log(err);
    console.log(x);
});

person.save()
    .then(x => console.log(x))
    .catch(err => console.log(`${err._message}: ${err.errors.name.properties.message}`));

async function save() {
    const x = await person5.save();
    console.log(x);
}
save();

Person.find({})
    .then(x => x.forEach(x => {
        console.log(JSON.stringify(x));
        x.getInfo();
        console.log(`I am born ${x.birthYear}`);
    })
);
    
Person.findById('600de73cbde6a64370c990c2')
    .then(x => { x.age = 43; return x.save(); })
    .then(x => console.log(x));

Person.findOne({ _id: '600de73cbde6a64370c990c2' })
    .then(x => console.log(x));

Person.updateOne({ _id: '600de73cbde6a64370c990c2' }, { $set: { name: 'Mariikata', age: 39 } })
    .then(x => console.log(x));

Person.deleteOne({ name: 'Stamat' })
    .then(x => console.log(x));

Person.countDocuments({ age: { $gt: 20, $lt: 43 } })
    .then(console.log);

async function run() {
    const count = await Person.countDocuments();
    console.log(count);
}
run();

Person.find()
    .where('age').gt(20).lt(43).sort({ age: -1 }).skip(1).limit(1)
    .then(x => console.log(x));

Person.find()
    .where('name').equals('Mariikata')
    .then(x => console.log(x));

Person.findOne({ age: 25 })
    .select('name')
    .then(x => console.log(x));

async function names() {
    // const names = await Person.find().select('name');
    const names = await Person.find({}, { _id: 0, name: 1 }).sort({ age: 1 });
    console.log(names);
}
names();