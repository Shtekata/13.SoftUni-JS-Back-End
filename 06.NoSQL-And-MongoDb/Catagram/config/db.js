import mongoose from 'mongoose';
import consts from '../consts.js';

const details = consts;

const uri = `mongodb+srv://${details}@shtekatacluster.0dh5a.mongodb.net/catagram?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connecton error:'));
db.once('open', () => console.log('Connected to database!'));

export default db;