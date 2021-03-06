import consts from './consts.js';

const config = {
    development: {
        PORT: process.env.PORT || 5000,
        DB_CONNECTION: `mongodb+srv://${consts.connectionPass}@shtekatacluster.0dh5a.mongodb.net/auth-demo?retryWrites=true&w=majority`
    },
    production: {
        PORT: process.env.PORT || 80,
        DB_CONNECTION: 'mongodb://localhost:27017/auth-demo'
    }
};

console.log(`Environtment: ${process.env.NODE_ENV}`);
export default config[process.env.NODE_ENV?.trim()||'development'];