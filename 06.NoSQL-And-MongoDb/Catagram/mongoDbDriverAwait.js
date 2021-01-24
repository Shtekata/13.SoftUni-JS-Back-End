import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });


async function run() {
    await client.connect();
    const db = client.db('catagram');
    const cats = db.collection('cats');
    
    const firstCat = await cats.findOne({});
    console.log(firstCat);
}

run();