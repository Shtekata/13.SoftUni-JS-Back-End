const config = {
    development: {
        PORT: 5000
    },
    production: {
        PORT: 80
    }
};

console.log(`Environtment: ${process.env.NODE_ENV}`);
export default config[process.env.NODE_ENV?.trim()||'development'];