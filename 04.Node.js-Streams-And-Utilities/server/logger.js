const logger = x => console.log(`This is from logger.js : Pet's name is ${x.name}`);
const logger2 = x => console.log(`This is from logger.js/eventEmitter : Pet's name is ${x.name}`);

import pubSub from './pubSub.js';

pubSub.subscribe('cats', logger);
pubSub.subscribe('dogs', logger);

import eventEmitter from './events.js';

eventEmitter.on('cats', logger2);
eventEmitter.on('dogs', logger2);
