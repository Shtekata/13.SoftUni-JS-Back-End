import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

client.connect()
    .then(x => {
        const db = client.db('catagram');
        const cats = db.collection('cats');
        return cats.findOne({});
    })
    .then(x => {
        console.log(x);
    });