import pubSub from './pubSub.js';

const names = [];

const onCatsRequest = (...params) => {
    const name = params[0].name;
    if (name) {
        names.includes(name) ?
            console.log(`Hello ${name} again!`) :
            (console.log(`We have new cat - ${name}`), names.push(name));
    }
};

pubSub.subscribe('cats', onCatsRequest);

const catLogger = x => console.log(`Logged new cat ${x.name}`);
pubSub.subscribe('cats', catLogger);