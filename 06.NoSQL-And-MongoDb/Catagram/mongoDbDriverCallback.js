import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

client.connect(err => {
    if (err) return console.log(err);

    const db = client.db('catagram');
    const cats = db.collection('cats');

    cats.findOne({ name: 'Garry' }, (err, x) => {
        if (err) return console.log(err);
        console.log(x);
    });
    
    cats.find({}, (err, x) => {
        if (err) return console.log(err);
        // console.log(x);
        x.toArray((err, x) => {
            if (err) return console.log(err);
            console.log(x);
        })
    })
});