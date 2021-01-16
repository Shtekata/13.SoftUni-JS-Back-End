const name = 'Pesho-Mesho';
console.log(`${name} from logger`);

function log(input) {
    console.log(`>>> ${input} <<<`);
}

// module.exports = log;
export default log;

