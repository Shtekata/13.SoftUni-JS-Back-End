var mongoose = require('mongoose');
const connectConst = require('./consts.js');

const uri = `mongodb+srv://${connectConst}@shtekatacluster.0dh5a.mongodb.net/auth?retryWrites=true&w=majority`;
const uri2 = `mongodb://localhost:27017/auth`;

mongoose.connect(uri, { useNewUrlParser: true });