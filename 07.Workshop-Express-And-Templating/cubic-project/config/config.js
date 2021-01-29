const config = {
    development: {
        PORT: process.env.PORT || 5000
    },
    production: {
        PORT: process.env.PORT || 80
    }
};

console.log(`Environtment: ${process.env.NODE_ENV}`);
export default config[process.env.NODE_ENV?.trim()||'development'];