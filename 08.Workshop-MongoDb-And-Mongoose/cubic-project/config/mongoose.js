import mongoose from 'mongoose';
import connectConst from './consts.js';

export default (app) => {
    const uri = `mongodb+srv://${connectConst}@shtekatacluster.0dh5a.mongodb.net/cubicle?retryWrites=true&w=majority`;
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connecton error:'));
    db.once('open', console.log.bind(console, 'Db Connected'));
};